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
      ok: { name: 'Александр', email: 'alex@ok.ru', avatar: '👨' },
      vk: { name: 'Мария', email: 'maria@vk.com', avatar: '👩' },
      telegram: { name: 'Дмитрий', email: 'dmitry@telegram.org', avatar: '👨‍💼' },
      google: { name: 'Анна', email: 'anna@gmail.com', avatar: '👩‍💻' }
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

            <Button
              onClick={() => handleSocialAuth('vk')}
              disabled={isLoading !== null}
              className="w-full h-14 text-base bg-[#0077FF] hover:bg-[#0066DD] text-white border-0 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading === 'vk' ? (
                <Icon name="Loader2" size={20} className="mr-3 animate-spin" />
              ) : (
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974h-3.255c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.376 2.708z"/>
                </svg>
              )}
              Войти через ВКонтакте
            </Button>

            <Button
              onClick={() => handleSocialAuth('telegram')}
              disabled={isLoading !== null}
              className="w-full h-14 text-base bg-[#0088cc] hover:bg-[#0077b3] text-white border-0 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading === 'telegram' ? (
                <Icon name="Loader2" size={20} className="mr-3 animate-spin" />
              ) : (
                <Icon name="Send" size={20} className="mr-3" />
              )}
              Войти через Telegram
            </Button>

            <Button
              onClick={() => handleSocialAuth('google')}
              disabled={isLoading !== null}
              className="w-full h-14 text-base bg-white hover:bg-gray-100 text-gray-900 border-0 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading === 'google' ? (
                <Icon name="Loader2" size={20} className="mr-3 animate-spin" />
              ) : (
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Войти через Google
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