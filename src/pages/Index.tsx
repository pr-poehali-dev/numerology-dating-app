import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const calculateLifePath = (date: string): number => {
  if (!date) return 0;
  const digits = date.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((acc, num) => acc + num, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((acc, num) => acc + num, 0);
  }
  return sum;
};

const calculateDestiny = (name: string): number => {
  if (!name) return 0;
  const values: { [key: string]: number } = {
    'а': 1, 'б': 2, 'в': 3, 'г': 4, 'д': 5, 'е': 6, 'ё': 6, 'ж': 7, 'з': 8, 'и': 9,
    'й': 1, 'к': 2, 'л': 3, 'м': 4, 'н': 5, 'о': 6, 'п': 7, 'р': 8, 'с': 9,
    'т': 1, 'у': 2, 'ф': 3, 'х': 4, 'ц': 5, 'ч': 6, 'ш': 7, 'щ': 8, 'ы': 9,
    'э': 1, 'ю': 2, 'я': 3,
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
    's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
  };
  
  let sum = name.toLowerCase().split('').reduce((acc, char) => {
    return acc + (values[char] || 0);
  }, 0);
  
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((acc, num) => acc + num, 0);
  }
  return sum;
};

const calculateCompatibility = (num1: number, num2: number): number => {
  const diff = Math.abs(num1 - num2);
  if (diff === 0) return 100;
  if (diff <= 2) return 85;
  if (diff <= 4) return 70;
  if (diff <= 6) return 55;
  return 40;
};

const getNumberMeaning = (num: number): string => {
  const meanings: { [key: number]: string } = {
    1: 'Лидер, первопроходец, независимость',
    2: 'Партнёрство, гармония, дипломатия',
    3: 'Творчество, самовыражение, общительность',
    4: 'Стабильность, практичность, надёжность',
    5: 'Свобода, перемены, приключения',
    6: 'Ответственность, забота, семья',
    7: 'Духовность, мудрость, анализ',
    8: 'Успех, власть, материальное благополучие',
    9: 'Гуманизм, идеализм, завершение циклов',
    11: 'Мастер-число: интуиция, духовное просветление',
    22: 'Мастер-число: великий строитель',
    33: 'Мастер-число: учитель мастеров'
  };
  return meanings[num] || '';
};

interface Profile {
  id: number;
  name: string;
  age: number;
  birthDate: string;
  lifePath: number;
  destiny: number;
  bio: string;
  avatar: string;
}

const mockProfiles: Profile[] = [
  {
    id: 1,
    name: 'Анна',
    age: 28,
    birthDate: '1996-03-15',
    lifePath: 6,
    destiny: 7,
    bio: 'Люблю йогу, медитацию и путешествия',
    avatar: '👩🏻'
  },
  {
    id: 2,
    name: 'Дмитрий',
    age: 32,
    birthDate: '1992-07-22',
    lifePath: 4,
    destiny: 8,
    bio: 'Предприниматель, ценю честность',
    avatar: '👨🏻'
  },
  {
    id: 3,
    name: 'Елена',
    age: 26,
    birthDate: '1998-11-08',
    lifePath: 9,
    destiny: 3,
    bio: 'Художница, мечтательница',
    avatar: '👩🏼'
  },
  {
    id: 4,
    name: 'Максим',
    age: 30,
    birthDate: '1994-05-18',
    lifePath: 1,
    destiny: 5,
    bio: 'Люблю активный отдых и новые знакомства',
    avatar: '👨🏼'
  }
];

const Index = () => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [lifePath, setLifePath] = useState<number | null>(null);
  const [destiny, setDestiny] = useState<number | null>(null);

  const handleCalculate = () => {
    const lp = calculateLifePath(birthDate);
    const dest = calculateDestiny(name);
    setLifePath(lp);
    setDestiny(dest);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 star-pattern pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4 tracking-wide">
            Numerology Love
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Найди свою судьбу через мудрость чисел
          </p>
        </header>

        <Tabs defaultValue="calculator" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card border border-border">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Calculator" size={18} className="mr-2" />
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="profiles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Users" size={18} className="mr-2" />
              Анкеты
            </TabsTrigger>
            <TabsTrigger value="guide" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="BookOpen" size={18} className="mr-2" />
              Справочник
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur border-border shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl text-primary flex items-center gap-3">
                  <Icon name="Sparkles" size={32} />
                  Расчёт нумерологических чисел
                </CardTitle>
                <CardDescription className="text-base">
                  Узнайте своё число жизненного пути и число судьбы
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">Полное имя</Label>
                    <Input
                      id="name"
                      placeholder="Иван Иванов"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-base">Дата рождения</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleCalculate} 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 shadow-lg"
                  disabled={!name || !birthDate}
                >
                  <Icon name="Wand2" size={20} className="mr-2" />
                  Рассчитать
                </Button>

                {lifePath !== null && destiny !== null && (
                  <div className="grid md:grid-cols-2 gap-6 mt-8 animate-fade-in">
                    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                          <Icon name="TrendingUp" size={24} />
                          Число жизненного пути
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-6xl font-bold text-primary text-center mb-4">
                          {lifePath}
                        </div>
                        <p className="text-center text-foreground/80">
                          {getNumberMeaning(lifePath)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                          <Icon name="Star" size={24} />
                          Число судьбы
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-6xl font-bold text-primary text-center mb-4">
                          {destiny}
                        </div>
                        <p className="text-center text-foreground/80">
                          {getNumberMeaning(destiny)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {mockProfiles.map((profile) => {
                const myLifePath = lifePath || 5;
                const compatibility = calculateCompatibility(myLifePath, profile.lifePath);
                
                return (
                  <Card key={profile.id} className="bg-card/80 backdrop-blur border-border hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 text-4xl">
                          <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                            {profile.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-2xl text-foreground">
                            {profile.name}, {profile.age}
                          </CardTitle>
                          <CardDescription className="mt-1">{profile.bio}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Жизненный путь</div>
                          <Badge variant="outline" className="text-lg border-primary text-primary">
                            {profile.lifePath}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Число судьбы</div>
                          <Badge variant="outline" className="text-lg border-primary text-primary">
                            {profile.destiny}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Совместимость</span>
                          <span className="text-primary font-semibold">{compatibility}%</span>
                        </div>
                        <Progress value={compatibility} className="h-2" />
                      </div>

                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Icon name="Heart" size={18} className="mr-2" />
                        Отправить сообщение
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur border-border">
              <CardHeader>
                <CardTitle className="text-3xl text-primary flex items-center gap-3">
                  <Icon name="BookOpen" size={32} />
                  Справочник нумерологии
                </CardTitle>
                <CardDescription className="text-base">
                  Значения чисел и их влияние на совместимость
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map((num) => (
                  <div key={num} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">{num}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">Число {num}</h3>
                      <p className="text-muted-foreground">{getNumberMeaning(num)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
