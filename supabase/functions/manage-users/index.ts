import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const { action, ...data } = body;

    // setup_admin doesn't require auth (one-time setup)
    if (action === "setup_admin") {
      const { email, password, name } = data;

      const { data: existingAdmins } = await supabaseAdmin.from("user_roles").select("id").eq("role", "admin");
      if (existingAdmins && existingAdmins.length > 0) {
        return new Response(JSON.stringify({ error: "Admin sudah ada" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { data: newAdmin, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name }
      });

      if (createError) {
        return new Response(JSON.stringify({ error: createError.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (newAdmin.user) {
        await supabaseAdmin.from("user_roles").update({ role: "admin" }).eq("user_id", newAdmin.user.id);
      }

      return new Response(JSON.stringify({ success: true, user: newAdmin.user }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // All other actions require admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: callingUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !callingUser) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: callerRoles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", callingUser.id);
    const isAdmin = callerRoles?.some((r: any) => r.role === "admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "create_user") {
      const { email, password, name, phone, role } = data;

      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name }
      });

      if (createError) {
        return new Response(JSON.stringify({ error: createError.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (role && role !== "customer" && newUser.user) {
        await supabaseAdmin.from("user_roles").update({ role }).eq("user_id", newUser.user.id);
      }

      if (phone && newUser.user) {
        await supabaseAdmin.from("profiles").update({ phone }).eq("user_id", newUser.user.id);
      }

      return new Response(JSON.stringify({ user: newUser.user }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
