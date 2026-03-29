import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ISOLIR_PROFILE = 'PROFIL-ISOLIR'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    const { action, pppoe_username, restore_profile } = await req.json()
    const { data: dbConfig } = await supabase
      .from('mikrotik_config').select('*').eq('is_active', true).limit(1).single()
    if (!dbConfig) {
      return new Response(JSON.stringify({ success: false, error: 'Konfigurasi MikroTik tidak ditemukan' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const { host, username, password } = dbConfig
    const apiUrl = `https://${host}/rest`
    const authHeader = 'Basic ' + btoa(`${username}:${password}`)
    console.log(`Action: ${action}, PPPoE: ${pppoe_username}`)
    const findRes = await fetch(`${apiUrl}/ppp/secret?name=${pppoe_username}`, {
      headers: { 'Authorization': authHeader }
    })
    if (!findRes.ok) {
      return new Response(JSON.stringify({ success: false, error: 'Gagal akses Mikrotik' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const secrets = await findRes.json()
    if (secrets.length === 0) {
      return new Response(JSON.stringify({ success: false, error: `Username ${pppoe_username} tidak ditemukan` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const secret = secrets[0]
    const secretId = secret['.id']
    const currentProfile = secret['profile']
    let result: any
    switch (action) {
      case 'isolate': {
        const res = await fetch(`${apiUrl}/ppp/secret/${secretId}`, {
          method: 'PATCH',
          headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: ISOLIR_PROFILE })
        })
        await kickSession(apiUrl, authHeader, pppoe_username)
        result = res.ok
          ? { success: true, message: `${pppoe_username} berhasil diisolir`, previous_profile: currentProfile }
          : { success: false, error: 'Gagal isolir pelanggan' }
        break
      }
      case 'activate': {
        if (!restore_profile) {
          result = { success: false, error: 'Masukkan nama profile paket', current_profile: currentProfile }
          break
        }
        const res = await fetch(`${apiUrl}/ppp/secret/${secretId}`, {
          method: 'PATCH',
          headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: restore_profile })
        })
        await kickSession(apiUrl, authHeader, pppoe_username)
        result = res.ok
          ? { success: true, message: `${pppoe_username} aktif dengan profile ${restore_profile}` }
          : { success: false, error: 'Gagal aktifkan pelanggan' }
        break
      }
      case 'reset_connection': {
        const kicked = await kickSession(apiUrl, authHeader, pppoe_username)
        result = { success: true, message: kicked ? `Koneksi ${pppoe_username} direset` : `${pppoe_username} tidak online` }
        break
      }
      case 'get_info': {
        const activeRes = await fetch(`${apiUrl}/ppp/active?name=${pppoe_username}`, { headers: { 'Authorization': authHeader } })
        const active = activeRes.ok ? await activeRes.json() : []
        result = { success: true, data: { username: pppoe_username, profile: currentProfile, is_online: active.length > 0, is_isolated: currentProfile === ISOLIR_PROFILE } }
        break
      }
      case 'get_users': {
        const res = await fetch(`${apiUrl}/ppp/active`, { headers: { 'Authorization': authHeader } })
        result = res.ok ? { success: true, data: await res.json() } : { success: false, error: 'Gagal ambil data' }
        break
      }
      default:
        result = { success: false, error: 'Action tidak valid' }
    }
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

async function kickSession(apiUrl: string, authHeader: string, username: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/ppp/active?name=${username}`, { headers: { 'Authorization': authHeader } })
    if (res.ok) {
      const sessions = await res.json()
      if (sessions.length > 0) {
        await fetch(`${apiUrl}/ppp/active/${sessions[0]['.id']}`, { method: 'DELETE', headers: { 'Authorization': authHeader } })
        return true
      }
    }
    return false
  } catch { return false }
}
