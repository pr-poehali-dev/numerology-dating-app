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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
    1: 'Лидерство, независимость, новые начинания. Прирождённые первопроходцы с сильной волей и уверенностью в себе',
    2: 'Партнёрство, дипломатия, чувствительность. Миротворцы, ценящие гармонию и баланс в отношениях',
    3: 'Творчество, самовыражение, коммуникабельность. Артистичные натуры с даром вдохновлять окружающих',
    4: 'Стабильность, практичность, трудолюбие. Надёжные строители, создающие прочный фундамент жизни',
    5: 'Свобода, перемены, приключения. Любители разнообразия, путешественники по жизни с гибким мышлением',
    6: 'Ответственность, забота, семейные ценности. Хранители домашнего очага с развитым чувством долга',
    7: 'Духовность, мудрость, аналитический ум. Искатели истины, погружённые в познание тайн мироздания',
    8: 'Власть, успех, материальное изобилие. Прирождённые управленцы с талантом к финансам и бизнесу',
    9: 'Гуманизм, сострадание, завершение циклов. Идеалисты, служащие высшему благу и помогающие людям',
    11: 'Мастер-число: портал духовности, мощная интуиция и паранормальные способности. Провидцы и вдохновители',
    22: 'Мастер-число: великий строитель, способность воплощать грандиозные проекты. Практичные визионеры',
    33: 'Мастер-число: учитель мастеров, высшее сострадание и служение человечеству. Духовные наставники'
  };
  return meanings[num] || '';
};

const getCompatibilityAnalysis = (num1: number, num2: number) => {
  const compatibility = calculateCompatibility(num1, num2);
  
  const analyses: { [key: string]: { title: string; description: string; strengths: string[]; challenges: string[] } } = {
    'same': {
      title: 'Идеальное зеркало душ',
      description: 'Одинаковые числа жизненного пути создают редкое явление — полное энергетическое совпадение. Вы словно смотрите в зеркало, видя в партнёре отражение собственной сущности. Такой союз наполнен глубоким пониманием на уровне интуиции, вы чувствуете друг друга без слов и движетесь в одном направлении.',
      strengths: ['Телепатическое взаимопонимание', 'Единство жизненных целей и ценностей', 'Безусловное принятие друг друга', 'Естественная синхронизация энергий'],
      challenges: ['Риск потери индивидуальности в союзе', 'Отсутствие динамики и вызовов', 'Необходимость сознательно вносить разнообразие', 'Усиление как положительных, так и отрицательных качеств']
    },
    'close': {
      title: 'Гармоничный резонанс',
      description: 'Ваши вибрации создают гармоничный резонанс — достаточно близкие для взаимопонимания, но с уникальными отличиями, которые делают отношения интересными. Это союз, где каждый дополняет другого, создавая более полную картину мира. Вы легко находите общий язык и вдохновляете друг друга на развитие.',
      strengths: ['Естественное взаимное дополнение', 'Лёгкость в общении и понимании', 'Стимуляция личностного роста', 'Баланс близости и самостоятельности'],
      challenges: ['Потребность в компромиссах', 'Уважение к различным подходам', 'Избегание конкуренции за лидерство', 'Принятие разных темпов развития']
    },
    'moderate': {
      title: 'Кармический вызов',
      description: 'Ваш союз несёт в себе кармический урок — учиться принимать и ценить противоположности. Различия в вибрациях создают как притяжение, так и трение. Это отношения, которые требуют сознательной работы, но взамен дают глубокую трансформацию обоим партнёрам. Вы открываете друг другу новые миры и расширяете понимание жизни.',
      strengths: ['Расширение сознания через различия', 'Освоение новых качеств от партнёра', 'Выход из зоны комфорта', 'Глубокая трансформация личности'],
      challenges: ['Непонимание мотивов и реакций', 'Разные жизненные приоритеты', 'Необходимость постоянного диалога', 'Риск эмоционального выгорания']
    },
    'challenging': {
      title: 'Алхимия противоположностей',
      description: 'Ваши числа находятся на противоположных концах нумерологического спектра — это союз великих контрастов. Подобно алхимической реакции, ваше взаимодействие может создать либо золото трансформации, либо разрушительный конфликт. Успех требует зрелости, мудрости и готовности учиться у кардинально другого человека. Это путь для духовно развитых душ.',
      strengths: ['Мощный потенциал взаимной трансформации', 'Освоение полярных качеств', 'Расширение картины мира', 'Сильное магнетическое притяжение'],
      challenges: ['Фундаментальные различия в мировоззрении', 'Высокий уровень конфликтности', 'Необходимость профессиональной помощи', 'Риск энергетического истощения', 'Требует духовной зрелости обоих']
    }
  };
  
  let category = 'challenging';
  if (compatibility === 100) category = 'same';
  else if (compatibility >= 70) category = 'close';
  else if (compatibility >= 55) category = 'moderate';
  
  return analyses[category];
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
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compatibilityFilter, setCompatibilityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  const handleCalculate = () => {
    const lp = calculateLifePath(birthDate);
    const dest = calculateDestiny(name);
    setLifePath(lp);
    setDestiny(dest);
  };

  const toggleFavorite = (profileId: number) => {
    setFavorites(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const filterProfiles = (profiles: Profile[]) => {
    const myLifePath = lifePath || 5;
    let filtered = profiles.filter(profile => {
      const compatibility = calculateCompatibility(myLifePath, profile.lifePath);
      if (compatibilityFilter === 'all') return true;
      if (compatibilityFilter === 'high') return compatibility >= 85;
      if (compatibilityFilter === 'medium') return compatibility >= 55 && compatibility < 85;
      if (compatibilityFilter === 'low') return compatibility < 55;
      return true;
    });

    if (sortBy === 'compatibility-high') {
      filtered = [...filtered].sort((a, b) => {
        const compA = calculateCompatibility(myLifePath, a.lifePath);
        const compB = calculateCompatibility(myLifePath, b.lifePath);
        return compB - compA;
      });
    } else if (sortBy === 'compatibility-low') {
      filtered = [...filtered].sort((a, b) => {
        const compA = calculateCompatibility(myLifePath, a.lifePath);
        const compB = calculateCompatibility(myLifePath, b.lifePath);
        return compA - compB;
      });
    }

    return filtered;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 star-pattern pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4 tracking-wide">
            Путь
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Найди свою судьбу через мудрость чисел
          </p>
        </header>

        <Tabs defaultValue="calculator" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-card border border-border">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Calculator" size={18} className="mr-2" />
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="profiles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Users" size={18} className="mr-2" />
              Анкеты
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Star" size={18} className="mr-2" />
              Избранное
              {favorites.length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">{favorites.length}</Badge>
              )}
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
            <Card className="bg-card/80 backdrop-blur border-border mb-6">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Icon name="Filter" size={20} />
                    Фильтр совместимости:
                  </Label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={compatibilityFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => setCompatibilityFilter('all')}
                      className={compatibilityFilter === 'all' ? 'bg-primary text-primary-foreground' : 'border-border'}
                    >
                      Все
                    </Button>
                    <Button
                      variant={compatibilityFilter === 'high' ? 'default' : 'outline'}
                      onClick={() => setCompatibilityFilter('high')}
                      className={compatibilityFilter === 'high' ? 'bg-primary text-primary-foreground' : 'border-border'}
                    >
                      <Icon name="TrendingUp" size={16} className="mr-2" />
                      Высокая (85%+)
                    </Button>
                    <Button
                      variant={compatibilityFilter === 'medium' ? 'default' : 'outline'}
                      onClick={() => setCompatibilityFilter('medium')}
                      className={compatibilityFilter === 'medium' ? 'bg-primary text-primary-foreground' : 'border-border'}
                    >
                      <Icon name="Minus" size={16} className="mr-2" />
                      Средняя (55-84%)
                    </Button>
                    <Button
                      variant={compatibilityFilter === 'low' ? 'default' : 'outline'}
                      onClick={() => setCompatibilityFilter('low')}
                      className={compatibilityFilter === 'low' ? 'bg-primary text-primary-foreground' : 'border-border'}
                    >
                      <Icon name="TrendingDown" size={16} className="mr-2" />
                      Низкая (&lt;55%)
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Icon name="ArrowUpDown" size={20} />
                    Сортировка:
                  </Label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={sortBy === 'default' ? 'default' : 'outline'}
                      onClick={() => setSortBy('default')}
                      className={sortBy === 'default' ? 'bg-primary text-primary-foreground' : 'border-border'}
                    >
                      По умолчанию
                    </Button>
                    <Button
                      variant={sortBy === 'compatibility-high' ? 'default' : 'outline'}
                      onClick={() => setSortBy('compatibility-high')}
                      className={sortBy === 'compatibility-high' ? 'bg-primary text-primary-foreground' : 'border-border'}
                    >
                      <Icon name="ArrowUp" size={16} className="mr-2" />
                      Совместимость ↓
                    </Button>
                    <Button
                      variant={sortBy === 'compatibility-low' ? 'default' : 'outline'}
                      onClick={() => setSortBy('compatibility-low')}
                      className={sortBy === 'compatibility-low' ? 'bg-primary text-primary-foreground' : 'border-border'}
                    >
                      <Icon name="ArrowDown" size={16} className="mr-2" />
                      Совместимость ↑
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {filterProfiles(mockProfiles).length === 0 ? (
              <Card className="bg-card/80 backdrop-blur border-border">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Icon name="Search" size={64} className="text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Никого не найдено</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Попробуйте изменить фильтр совместимости
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filterProfiles(mockProfiles).map((profile) => {
                const myLifePath = lifePath || 5;
                const compatibility = calculateCompatibility(myLifePath, profile.lifePath);
                
                return (
                  <Card key={profile.id} className="bg-card/80 backdrop-blur border-border hover:shadow-xl transition-shadow relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 z-10 hover:bg-transparent"
                      onClick={() => toggleFavorite(profile.id)}
                    >
                      <Icon 
                        name="Star" 
                        size={24} 
                        className={favorites.includes(profile.id) ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}
                      />
                    </Button>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 text-4xl">
                          <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                            {profile.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 pr-8">
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

                      <div className="grid grid-cols-2 gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="border-primary text-primary hover:bg-primary/10"
                              onClick={() => setSelectedProfile(profile)}
                            >
                              <Icon name="Sparkles" size={18} className="mr-2" />
                              Анализ
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-card border-border">
                            <DialogHeader>
                              <DialogTitle className="text-3xl text-primary flex items-center gap-3">
                                <Icon name="Infinity" size={32} />
                                Детальный анализ совместимости
                              </DialogTitle>
                              <DialogDescription>
                                {name || 'Вы'} и {profile.name}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedProfile && (
                              <div className="space-y-6 mt-4">
                                <div className="flex items-center justify-center gap-8">
                                  <div className="text-center">
                                    <Avatar className="h-20 w-20 mx-auto mb-2 text-5xl">
                                      <AvatarFallback className="bg-primary/20 text-primary text-4xl">
                                        👤
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="font-semibold">{name || 'Вы'}</div>
                                    <Badge variant="outline" className="mt-2 border-primary text-primary">
                                      Путь: {myLifePath}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex flex-col items-center">
                                    <Icon name="Heart" size={32} className="text-primary animate-pulse" />
                                    <div className="text-4xl font-bold text-primary mt-2">{compatibility}%</div>
                                  </div>
                                  
                                  <div className="text-center">
                                    <Avatar className="h-20 w-20 mx-auto mb-2 text-5xl">
                                      <AvatarFallback className="bg-primary/20 text-primary text-4xl">
                                        {selectedProfile.avatar}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="font-semibold">{selectedProfile.name}</div>
                                    <Badge variant="outline" className="mt-2 border-primary text-primary">
                                      Путь: {selectedProfile.lifePath}
                                    </Badge>
                                  </div>
                                </div>

                                <Progress value={compatibility} className="h-3" />

                                {(() => {
                                  const analysis = getCompatibilityAnalysis(myLifePath, selectedProfile.lifePath);
                                  return (
                                    <>
                                      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
                                        <CardHeader>
                                          <CardTitle className="text-2xl text-primary">{analysis.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <p className="text-foreground/90">{analysis.description}</p>
                                        </CardContent>
                                      </Card>

                                      <div className="grid md:grid-cols-2 gap-4">
                                        <Card className="bg-secondary/50 border-border">
                                          <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                              <Icon name="ThumbsUp" size={20} className="text-green-500" />
                                              Сильные стороны
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <ul className="space-y-2">
                                              {analysis.strengths.map((strength, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                  <Icon name="Check" size={16} className="text-green-500 mt-1 flex-shrink-0" />
                                                  <span className="text-sm text-foreground/80">{strength}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </CardContent>
                                        </Card>

                                        <Card className="bg-secondary/50 border-border">
                                          <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                              <Icon name="AlertTriangle" size={20} className="text-amber-500" />
                                              Что учесть
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <ul className="space-y-2">
                                              {analysis.challenges.map((challenge, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                  <Icon name="Info" size={16} className="text-amber-500 mt-1 flex-shrink-0" />
                                                  <span className="text-sm text-foreground/80">{challenge}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </CardContent>
                                        </Card>
                                      </div>

                                      <div className="grid md:grid-cols-2 gap-4">
                                        <Card className="bg-secondary/30 border-border">
                                          <CardHeader>
                                            <CardTitle className="text-base flex items-center gap-2">
                                              <Icon name="User" size={18} />
                                              {name || 'Ваше'} число {myLifePath}
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <p className="text-sm text-muted-foreground">{getNumberMeaning(myLifePath)}</p>
                                          </CardContent>
                                        </Card>

                                        <Card className="bg-secondary/30 border-border">
                                          <CardHeader>
                                            <CardTitle className="text-base flex items-center gap-2">
                                              <Icon name="User" size={18} />
                                              {selectedProfile.name} число {selectedProfile.lifePath}
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <p className="text-sm text-muted-foreground">{getNumberMeaning(selectedProfile.lifePath)}</p>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          <Icon name="Heart" size={18} className="mr-2" />
                          Написать
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {favorites.length === 0 ? (
              <Card className="bg-card/80 backdrop-blur border-border">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Icon name="Star" size={64} className="text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Избранное пусто</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Добавляйте понравившиеся профили в избранное, нажимая на звёздочку в карточке анкеты
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {mockProfiles.filter(p => favorites.includes(p.id)).map((profile) => {
                  const myLifePath = lifePath || 5;
                  const compatibility = calculateCompatibility(myLifePath, profile.lifePath);
                  
                  return (
                    <Card key={profile.id} className="bg-card/80 backdrop-blur border-border hover:shadow-xl transition-shadow relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-10 hover:bg-transparent"
                        onClick={() => toggleFavorite(profile.id)}
                      >
                        <Icon 
                          name="Star" 
                          size={24} 
                          className="fill-primary text-primary"
                        />
                      </Button>
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16 text-4xl">
                            <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                              {profile.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 pr-8">
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

                        <div className="grid grid-cols-2 gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="border-primary text-primary hover:bg-primary/10"
                                onClick={() => setSelectedProfile(profile)}
                              >
                                <Icon name="Sparkles" size={18} className="mr-2" />
                                Анализ
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl bg-card border-border">
                              <DialogHeader>
                                <DialogTitle className="text-3xl text-primary flex items-center gap-3">
                                  <Icon name="Infinity" size={32} />
                                  Детальный анализ совместимости
                                </DialogTitle>
                                <DialogDescription>
                                  {name || 'Вы'} и {profile.name}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedProfile && (
                                <div className="space-y-6 mt-4">
                                  <div className="flex items-center justify-center gap-8">
                                    <div className="text-center">
                                      <Avatar className="h-20 w-20 mx-auto mb-2 text-5xl">
                                        <AvatarFallback className="bg-primary/20 text-primary text-4xl">
                                          👤
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="font-semibold">{name || 'Вы'}</div>
                                      <Badge variant="outline" className="mt-2 border-primary text-primary">
                                        Путь: {myLifePath}
                                      </Badge>
                                    </div>
                                    
                                    <div className="flex flex-col items-center">
                                      <Icon name="Heart" size={32} className="text-primary animate-pulse" />
                                      <div className="text-4xl font-bold text-primary mt-2">{compatibility}%</div>
                                    </div>
                                    
                                    <div className="text-center">
                                      <Avatar className="h-20 w-20 mx-auto mb-2 text-5xl">
                                        <AvatarFallback className="bg-primary/20 text-primary text-4xl">
                                          {selectedProfile.avatar}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="font-semibold">{selectedProfile.name}</div>
                                      <Badge variant="outline" className="mt-2 border-primary text-primary">
                                        Путь: {selectedProfile.lifePath}
                                      </Badge>
                                    </div>
                                  </div>

                                  <Progress value={compatibility} className="h-3" />

                                  {(() => {
                                    const analysis = getCompatibilityAnalysis(myLifePath, selectedProfile.lifePath);
                                    return (
                                      <>
                                        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
                                          <CardHeader>
                                            <CardTitle className="text-2xl text-primary">{analysis.title}</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <p className="text-foreground/90">{analysis.description}</p>
                                          </CardContent>
                                        </Card>

                                        <div className="grid md:grid-cols-2 gap-4">
                                          <Card className="bg-secondary/50 border-border">
                                            <CardHeader>
                                              <CardTitle className="text-lg flex items-center gap-2">
                                                <Icon name="ThumbsUp" size={20} className="text-green-500" />
                                                Сильные стороны
                                              </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                              <ul className="space-y-2">
                                                {analysis.strengths.map((strength, idx) => (
                                                  <li key={idx} className="flex items-start gap-2">
                                                    <Icon name="Check" size={16} className="text-green-500 mt-1 flex-shrink-0" />
                                                    <span className="text-sm text-foreground/80">{strength}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </CardContent>
                                          </Card>

                                          <Card className="bg-secondary/50 border-border">
                                            <CardHeader>
                                              <CardTitle className="text-lg flex items-center gap-2">
                                                <Icon name="AlertTriangle" size={20} className="text-amber-500" />
                                                Что учесть
                                              </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                              <ul className="space-y-2">
                                                {analysis.challenges.map((challenge, idx) => (
                                                  <li key={idx} className="flex items-start gap-2">
                                                    <Icon name="Info" size={16} className="text-amber-500 mt-1 flex-shrink-0" />
                                                    <span className="text-sm text-foreground/80">{challenge}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </CardContent>
                                          </Card>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                          <Card className="bg-secondary/30 border-border">
                                            <CardHeader>
                                              <CardTitle className="text-base flex items-center gap-2">
                                                <Icon name="User" size={18} />
                                                {name || 'Ваше'} число {myLifePath}
                                              </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                              <p className="text-sm text-muted-foreground">{getNumberMeaning(myLifePath)}</p>
                                            </CardContent>
                                          </Card>

                                          <Card className="bg-secondary/30 border-border">
                                            <CardHeader>
                                              <CardTitle className="text-base flex items-center gap-2">
                                                <Icon name="User" size={18} />
                                                {selectedProfile.name} число {selectedProfile.lifePath}
                                              </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                              <p className="text-sm text-muted-foreground">{getNumberMeaning(selectedProfile.lifePath)}</p>
                                            </CardContent>
                                          </Card>
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Icon name="Heart" size={18} className="mr-2" />
                            Написать
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
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