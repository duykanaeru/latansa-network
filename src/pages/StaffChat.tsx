import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare,
  Send,
  Search,
  User,
  Clock,
  CheckCircle,
  BarChart3,
  Ticket,
  Wrench,
  Paperclip,
  Smile
} from "lucide-react";

const StaffChat = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>("chat-1");
  const [messageInput, setMessageInput] = useState("");

  const navigation = [
    { name: "Dashboard", href: "/staff/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/staff/tickets", icon: <Ticket className="h-4 w-4" /> },
    { name: "Troubleshooting", href: "/staff/troubleshoot", icon: <Wrench className="h-4 w-4" /> },
    { name: "Chat Support", href: "/staff/chat", icon: <MessageSquare className="h-4 w-4" /> },
  ];

  const conversations = [
    {
      id: "chat-1",
      customer: "Budi Santoso",
      customerId: "NSP-2021-045",
      lastMessage: "Terima kasih atas bantuannya",
      timestamp: "2 menit lalu",
      unread: 0,
      status: "online"
    },
    {
      id: "chat-2",
      customer: "Siti Nurhaliza",
      customerId: "NSP-2023-089",
      lastMessage: "Internet masih lambat",
      timestamp: "5 menit lalu",
      unread: 2,
      status: "online"
    },
    {
      id: "chat-3",
      customer: "Ahmad Rizki",
      customerId: "NSP-2024-001",
      lastMessage: "Kapan bisa diperbaiki?",
      timestamp: "15 menit lalu",
      unread: 1,
      status: "away"
    },
    {
      id: "chat-4",
      customer: "Dewi Lestari",
      customerId: "NSP-2023-067",
      lastMessage: "Ok, sudah normal kembali",
      timestamp: "1 jam lalu",
      unread: 0,
      status: "offline"
    },
  ];

  const messages = selectedChat === "chat-1" ? [
    {
      id: 1,
      sender: "customer",
      text: "Halo, saya ada masalah dengan koneksi internet",
      timestamp: "14:30"
    },
    {
      id: 2,
      sender: "staff",
      text: "Halo Pak Budi, saya akan bantu cek. Bisa info kendala yang dialami?",
      timestamp: "14:31"
    },
    {
      id: 3,
      sender: "customer",
      text: "Internet sering putus-putus sejak tadi pagi",
      timestamp: "14:32"
    },
    {
      id: 4,
      sender: "staff",
      text: "Baik, saya sudah cek dari sistem. Ada gangguan kecil di area Bapak. Tim teknisi sudah mengatasi masalahnya. Mohon dicoba kembali koneksinya.",
      timestamp: "14:35"
    },
    {
      id: 5,
      sender: "customer",
      text: "Sudah normal kembali. Terima kasih atas bantuannya",
      timestamp: "14:38"
    },
  ] : [];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  return (
    <DashboardLayout
      title="Chat Support"
      userRole="staff"
      userName="Staff Technical"
      navigation={navigation}
    >
      <Card className="h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Conversation List */}
          <div className="border-r border-border">
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-8rem)]">
              <div className="space-y-2 p-4">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChat(conv.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat === conv.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {conv.customer.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{conv.customer}</div>
                          <div className={`text-xs ${selectedChat === conv.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {conv.customerId}
                          </div>
                        </div>
                      </div>
                      {conv.unread > 0 && (
                        <Badge className="bg-destructive text-destructive-foreground">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                    <div className={`text-xs ${selectedChat === conv.id ? 'text-primary-foreground/70' : 'text-muted-foreground'} truncate`}>
                      {conv.lastMessage}
                    </div>
                    <div className={`text-xs ${selectedChat === conv.id ? 'text-primary-foreground/70' : 'text-muted-foreground'} mt-1`}>
                      {conv.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>BS</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">Budi Santoso</CardTitle>
                        <CardDescription>NSP-2021-045 • Online</CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardHeader>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "staff" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.sender === "staff"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="text-sm">{msg.text}</div>
                          <div className={`text-xs mt-1 ${
                            msg.sender === "staff" 
                              ? "text-primary-foreground/70" 
                              : "text-muted-foreground"
                          }`}>
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default StaffChat;
