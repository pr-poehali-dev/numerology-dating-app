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
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleYandexAuth = async () => {
    if (!email || !email.includes('@')) return;
    
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const name = email.split('@')[0];
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    onAuth({
      name: capitalizedName,
      email: email,
      avatar: '👤'
    });
    
    setIsLoading(false);
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
              Быстрый вход через email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleYandexAuth()}
                className="glass-effect border-white/10 h-12 text-base focus:border-primary/50 transition-all"
              />
            </div>

            <Button
              onClick={handleYandexAuth}
              disabled={isLoading || !email || !email.includes('@')}
              className="w-full h-14 text-base bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-white border-0 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <Icon name="Loader2" size={20} className="mr-3 animate-spin" />
              ) : (
                <Icon name="LogIn" size={20} className="mr-3" />
              )}
              Войти
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