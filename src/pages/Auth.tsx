import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface AuthProps {
  onAuth: (userData: { name: string; email: string; avatar: string }) => void;
}

const Auth = ({ onAuth }: AuthProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSocialAuth = async (provider: string) => {
    setIsLoading(provider);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUsers = {
      ok: { name: 'Александр', email: 'alex@ok.ru', avatar: '👨' }
    };
    
    onAuth(mockUsers[provider as keyof typeof mockUsers] || mockUsers.ok);
    setIsLoading(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 gradient-mesh pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-md">
        <div className="text-center mb-12">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full glass-effect">
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Нумерология нового поколения
            </span>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-br from-white via-primary to-purple-300 bg-clip-text text-transparent">
            Путь
          </h1>
          <p className="text-lg text-foreground/70">
            Войдите, чтобы найти свою судьбу
          </p>
        </div>

        <Card className="glass-effect shadow-2xl border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none rounded-lg"></div>
          <CardHeader className="relative text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Вход в приложение
            </CardTitle>
            <CardDescription className="text-base text-foreground/60">
              Войдите через социальные сети
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 relative">
            <Button
              onClick={() => handleSocialAuth('ok')}
              disabled={isLoading !== null}
              className="w-full h-14 text-base bg-[#EE8208] hover:bg-[#D97507] text-white border-0 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading === 'ok' ? (
                <Icon name="Loader2" size={20} className="mr-3 animate-spin" />
              ) : (
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 7.7c1.2 0 2.1.9 2.1 2.1s-.9 2.1-2.1 2.1-2.1-.9-2.1-2.1.9-2.1 2.1-2.1zm5.6 10.7c-.4.4-1 .4-1.4 0l-2.8-2.8-2.8 2.8c-.4.4-1 .4-1.4 0s-.4-1 0-1.4l2.8-2.8-2.8-2.8c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l2.8 2.8 2.8-2.8c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-2.8 2.8 2.8 2.8c.4.4.4 1 0 1.4z"/>
                </svg>
              )}
              Войти через Одноклассники
            </Button>

            <div className="pt-4 text-center">
              <p className="text-sm text-foreground/50">
                Продолжая, вы соглашаетесь с{' '}
                <button className="text-primary hover:underline">условиями использования</button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-foreground/60">
            Нет аккаунта? Он создастся автоматически при первом входе
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;