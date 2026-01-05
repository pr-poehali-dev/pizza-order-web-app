import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  price30?: number;
  category: 'pizza' | 'snacks' | 'drinks';
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
  size?: '25' | '30';
}

interface User {
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  orders: Order[];
}

interface Order {
  id: number;
  date: string;
  items: CartItem[];
  total: number;
  status: string;
  deliveryMethod: string;
  paymentMethod: string;
  address?: string;
}

const menuData: MenuItem[] = [
  { id: 1, name: 'Маргарита', description: 'Томаты, моцарелла, базилик', price: 450, price30: 650, category: 'pizza', image: 'https://cdn.poehali.dev/projects/2b21aadd-60ed-4589-8a75-633a6fb0ed0a/files/5011c16e-2907-4225-85e3-842b92a19450.jpg' },
  { id: 2, name: 'Пепперони', description: 'Пепперони, моцарелла, томатный соус', price: 550, price30: 750, category: 'pizza', image: 'https://cdn.poehali.dev/projects/2b21aadd-60ed-4589-8a75-633a6fb0ed0a/files/07d7352d-ac93-4e27-8d55-ac4133b3d931.jpg' },
  { id: 3, name: 'Четыре сыра', description: 'Моцарелла, дор блю, пармезан, чеддер', price: 600, price30: 800, category: 'pizza', image: 'https://cdn.poehali.dev/projects/2b21aadd-60ed-4589-8a75-633a6fb0ed0a/files/ccff1b8a-6679-482e-b177-cc32dca7439e.jpg' },
  { id: 4, name: 'Гавайская', description: 'Курица, ананас, моцарелла', price: 520, price30: 720, category: 'pizza', image: 'https://cdn.poehali.dev/projects/2b21aadd-60ed-4589-8a75-633a6fb0ed0a/files/5011c16e-2907-4225-85e3-842b92a19450.jpg' },
  { id: 5, name: 'Барбекю', description: 'Курица, бекон, соус барбекю, лук', price: 580, price30: 780, category: 'pizza', image: 'https://cdn.poehali.dev/projects/2b21aadd-60ed-4589-8a75-633a6fb0ed0a/files/07d7352d-ac93-4e27-8d55-ac4133b3d931.jpg' },
  { id: 6, name: 'Вегетарианская', description: 'Перец, помидоры, грибы, маслины, руккола', price: 490, price30: 690, category: 'pizza', image: 'https://cdn.poehali.dev/projects/2b21aadd-60ed-4589-8a75-633a6fb0ed0a/files/ccff1b8a-6679-482e-b177-cc32dca7439e.jpg' },
  { id: 7, name: 'Мясная', description: 'Пепперони, ветчина, говядина, курица', price: 650, price30: 850, category: 'pizza', image: 'https://cdn.poehali.dev/projects/2b21aadd-60ed-4589-8a75-633a6fb0ed0a/files/07d7352d-ac93-4e27-8d55-ac4133b3d931.jpg' },
  { id: 8, name: 'Диабло', description: 'Острая салями, халапеньо, чили', price: 570, price30: 770, category: 'pizza', image: 'https://cdn.poehali.dev/projects/2b21aadd-60ed-4589-8a75-633a6fb0ed0a/files/5011c16e-2907-4225-85e3-842b92a19450.jpg' },
  { id: 9, name: 'Сицилийская', description: 'Анчоусы, каперсы, оливки, томаты', price: 590, price30: 790, category: 'pizza', image: 'https://cdn.poehali.dev/projects/2b21aadd-60ed-4589-8a75-633a6fb0ed0a/files/ccff1b8a-6679-482e-b177-cc32dca7439e.jpg' },
  { id: 10, name: 'Карбонара', description: 'Бекон, яйцо, пармезан, сливки', price: 560, price30: 760, category: 'pizza', image: 'https://cdn.poehali.dev/projects/2b21aadd-60ed-4589-8a75-633a6fb0ed0a/files/5011c16e-2907-4225-85e3-842b92a19450.jpg' },
  { id: 11, name: 'С грушей', description: 'Груша, дор блю, грецкий орех, мёд', price: 620, price30: 820, category: 'pizza', image: 'https://cdn.poehali.dev/projects/2b21aadd-60ed-4589-8a75-633a6fb0ed0a/files/07d7352d-ac93-4e27-8d55-ac4133b3d931.jpg' },
  { id: 12, name: 'Песто', description: 'Соус песто, моцарелла, томаты черри, руккола', price: 540, price30: 740, category: 'pizza', image: 'https://cdn.poehali.dev/projects/2b21aadd-60ed-4589-8a75-633a6fb0ed0a/files/ccff1b8a-6679-482e-b177-cc32dca7439e.jpg' },
  { id: 13, name: 'Морская', description: 'Креветки, кальмары, мидии, лимон', price: 720, price30: 920, category: 'pizza', image: 'https://cdn.poehali.dev/projects/2b21aadd-60ed-4589-8a75-633a6fb0ed0a/files/5011c16e-2907-4225-85e3-842b92a19450.jpg' },
  { id: 14, name: 'Куриные крылышки', description: 'Острые крылышки с соусом барбекю', price: 320, category: 'snacks', image: '🍗' },
  { id: 15, name: 'Картофель фри', description: 'Хрустящий картофель с соусом', price: 180, category: 'snacks', image: '🍟' },
  { id: 16, name: 'Чесночные гренки', description: 'С сыром и чесночным соусом', price: 150, category: 'snacks', image: '🥖' },
  { id: 17, name: 'Моцарелла фри', description: 'Сырные палочки в панировке', price: 250, category: 'snacks', image: '🧀' },
  { id: 18, name: 'Цезарь салат', description: 'Курица, салат, пармезан, соус цезарь', price: 280, category: 'snacks', image: '🥗' },
  { id: 19, name: 'Лимонад классический', description: 'Освежающий домашний лимонад', price: 120, category: 'drinks', image: '🍋' },
  { id: 20, name: 'Лимонад ягодный', description: 'С клубникой и малиной', price: 140, category: 'drinks', image: '🍓' },
  { id: 21, name: 'Лимонад манго-маракуйя', description: 'Тропический микс', price: 150, category: 'drinks', image: '🥭' },
];

const reviews = [
  { id: 1, name: 'Алексей К.', rating: 5, text: 'Лучшая пицца в городе! Всегда свежая и вкусная.', date: '15.12.2024' },
  { id: 2, name: 'Мария С.', rating: 5, text: 'Быстрая доставка, пицца горячая. Спасибо!', date: '12.12.2024' },
  { id: 3, name: 'Дмитрий П.', rating: 4, text: 'Отличное качество, единственное - хотелось бы больше акций.', date: '10.12.2024' },
  { id: 4, name: 'Елена В.', rating: 5, text: 'Программа лояльности супер! Уже накопила баллы на бесплатную пиццу.', date: '08.12.2024' },
];

function PizzaShop() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'menu' | 'about' | 'delivery' | 'contacts' | 'reviews' | 'account'>('home');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<Record<number, '25' | '30'>>({});
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authPhone, setAuthPhone] = useState('');
  const [user, setUser] = useState<User | null>(null);

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'online'>('card');
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: '',
    comment: '',
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = () => {
    if (!authPhone || authPhone.length < 10) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректный номер телефона',
        variant: 'destructive',
      });
      return;
    }

    setUser({
      name: 'Пользователь',
      phone: authPhone,
      email: `user${authPhone.slice(-4)}@pizza.ru`,
      loyaltyPoints: 0,
      orders: [],
    });

    setOrderForm(prev => ({ ...prev, phone: authPhone }));
    setIsAuthOpen(false);
    toast({
      title: 'Добро пожаловать!',
      description: 'Вы успешно вошли в систему',
    });
  };

  const handleLogout = () => {
    setUser(null);
    setOrderForm({ name: '', phone: '', address: '', comment: '' });
    toast({
      title: 'Вы вышли',
      description: 'До новых встреч!',
    });
  };

  const addToCart = (item: MenuItem, size?: '25' | '30') => {
    setAddingToCart(item.id);
    
    setTimeout(() => {
      const pizzaSize = item.category === 'pizza' ? (size || selectedSize[item.id] || '25') : undefined;
      const itemPrice = item.category === 'pizza' && pizzaSize === '30' ? (item.price30 || item.price) : item.price;
      
      setCart(prev => {
        const existing = prev.find(i => i.id === item.id && i.size === pizzaSize);
        if (existing) {
          return prev.map(i => 
            i.id === item.id && i.size === pizzaSize 
              ? { ...i, quantity: i.quantity + 1 } 
              : i
          );
        }
        return [...prev, { ...item, price: itemPrice, quantity: 1, size: pizzaSize }];
      });
      
      toast({
        title: 'Добавлено в корзину',
        description: `${item.name}${pizzaSize ? ` (${pizzaSize}см)` : ''} - ${itemPrice}₽`,
      });
      
      setAddingToCart(null);
    }, 300);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const loyaltyPointsEarned = Math.floor(cartTotal / 100);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: 'Корзина пуста',
        description: 'Добавьте товары для оформления заказа',
        variant: 'destructive',
      });
      return;
    }

    if (!orderForm.name || !orderForm.phone || (deliveryMethod === 'delivery' && !orderForm.address)) {
      toast({
        title: 'Заполните все поля',
        description: 'Укажите имя, телефон и адрес доставки',
        variant: 'destructive',
      });
      return;
    }

    const newOrder: Order = {
      id: (user?.orders.length || 0) + 1,
      date: new Date().toLocaleDateString('ru-RU'),
      items: [...cart],
      total: cartTotal,
      status: 'Готовится',
      deliveryMethod,
      paymentMethod,
      address: deliveryMethod === 'delivery' ? orderForm.address : 'Самовывоз',
    };

    if (user) {
      setUser({
        ...user,
        loyaltyPoints: user.loyaltyPoints + loyaltyPointsEarned,
        orders: [newOrder, ...user.orders],
      });
    }

    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCurrentPage('account');

    toast({
      title: 'Заказ оформлен!',
      description: `Заказ №${newOrder.id}. Вы получили ${loyaltyPointsEarned} бонусов!`,
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-12">
            <section className="relative bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10 rounded-2xl p-8 md:p-16 overflow-hidden">
              <div className="relative z-10 max-w-2xl animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary">Пицца Мчится</h1>
                <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
                  Настоящая итальянская пицца с доставкой за 30 минут или бесплатно!
                </p>
                <Button size="lg" onClick={() => setCurrentPage('menu')} className="text-lg px-8">
                  <Icon name="Pizza" className="mr-2" />
                  Смотреть меню
                </Button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-9xl opacity-20">🍕</div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6">Популярные позиции</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {menuData.filter(item => item.category === 'pizza').slice(0, 3).map(item => (
                  <Card key={item.id} className="hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="w-full h-48 overflow-hidden rounded-t-lg">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {item.category === 'pizza' && (
                        <div className="flex gap-2 mb-3">
                          <Button
                            size="sm"
                            variant={selectedSize[item.id] === '25' || !selectedSize[item.id] ? 'default' : 'outline'}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSize(prev => ({ ...prev, [item.id]: '25' }));
                            }}
                            className="flex-1"
                          >
                            25см - {item.price}₽
                          </Button>
                          <Button
                            size="sm"
                            variant={selectedSize[item.id] === '30' ? 'default' : 'outline'}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSize(prev => ({ ...prev, [item.id]: '30' }));
                            }}
                            className="flex-1"
                          >
                            30см - {item.price30}₽
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">{item.price}₽</span>
                      <Button 
                        onClick={() => addToCart(item, selectedSize[item.id] || '25')}
                        disabled={addingToCart === item.id}
                        className={addingToCart === item.id ? 'scale-110' : ''}
                      >
                        <Icon name={addingToCart === item.id ? 'Check' : 'ShoppingCart'} className="mr-2" size={16} />
                        {addingToCart === item.id ? 'Добавлено!' : 'В корзину'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            <section className="bg-secondary/30 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold mb-2">Быстрая доставка</h3>
                  <p className="text-muted-foreground">30 минут или бесплатно</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🎁</div>
                  <h3 className="text-xl font-bold mb-2">Программа лояльности</h3>
                  <p className="text-muted-foreground">Копите баллы и получайте подарки</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">👨‍🍳</div>
                  <h3 className="text-xl font-bold mb-2">Лучшие повара</h3>
                  <p className="text-muted-foreground">Настоящие итальянские рецепты</p>
                </div>
              </div>
            </section>
          </div>
        );

      case 'menu':
        return (
          <div>
            <h1 className="text-4xl font-bold mb-8">Меню</h1>
            <Tabs defaultValue="pizza" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pizza">Пиццы</TabsTrigger>
                <TabsTrigger value="snacks">Закуски</TabsTrigger>
                <TabsTrigger value="drinks">Напитки</TabsTrigger>
              </TabsList>
              <TabsContent value="pizza" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {menuData.filter(item => item.category === 'pizza').map(item => (
                    <Card key={item.id} className="hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="w-full h-48 overflow-hidden rounded-t-lg">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {item.category === 'pizza' && (
                          <div className="flex gap-2 mb-3">
                            <Button
                              size="sm"
                              variant={selectedSize[item.id] === '25' || !selectedSize[item.id] ? 'default' : 'outline'}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSize(prev => ({ ...prev, [item.id]: '25' }));
                              }}
                              className="flex-1"
                            >
                              25см - {item.price}₽
                            </Button>
                            <Button
                              size="sm"
                              variant={selectedSize[item.id] === '30' ? 'default' : 'outline'}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSize(prev => ({ ...prev, [item.id]: '30' }));
                              }}
                              className="flex-1"
                            >
                              30см - {item.price30}₽
                            </Button>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">{item.price}₽</span>
                        <Button 
                          onClick={() => addToCart(item, selectedSize[item.id] || '25')}
                          disabled={addingToCart === item.id}
                          className={addingToCart === item.id ? 'scale-110' : ''}
                        >
                          <Icon name={addingToCart === item.id ? 'Check' : 'ShoppingCart'} className="mr-2" size={16} />
                          {addingToCart === item.id ? 'Добавлено!' : 'В корзину'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="snacks" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {menuData.filter(item => item.category === 'snacks').map(item => (
                    <Card key={item.id} className="hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="w-full h-48 overflow-hidden rounded-t-lg">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">{item.price}₽</span>
                        <Button 
                          onClick={() => addToCart(item)}
                          disabled={addingToCart === item.id}
                          className={addingToCart === item.id ? 'scale-110' : ''}
                        >
                          <Icon name={addingToCart === item.id ? 'Check' : 'ShoppingCart'} className="mr-2" size={16} />
                          {addingToCart === item.id ? 'Добавлено!' : 'В корзину'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="drinks" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {menuData.filter(item => item.category === 'drinks').map(item => (
                    <Card key={item.id} className="hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="w-full h-48 overflow-hidden rounded-t-lg">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">{item.price}₽</span>
                        <Button 
                          onClick={() => addToCart(item)}
                          disabled={addingToCart === item.id}
                          className={addingToCart === item.id ? 'scale-110' : ''}
                        >
                          <Icon name={addingToCart === item.id ? 'Check' : 'ShoppingCart'} className="mr-2" size={16} />
                          {addingToCart === item.id ? 'Добавлено!' : 'В корзину'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'about':
        return (
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold mb-8">О нас</h1>
            <Card>
              <CardHeader>
                <CardTitle>История</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  "Пицца Мчится" - это семейная пиццерия, основанная в 2020 году. Мы верим, что настоящая итальянская пицца 
                  должна быть доступна каждому, и делаем всё возможное, чтобы наши клиенты получали только лучшее.
                </p>
                <p>
                  Наши повара прошли обучение в Италии и используют только проверенные рецепты. Мы готовим тесто каждый день 
                  и используем только свежие ингредиенты от проверенных поставщиков.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Наши преимущества</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1" />
                    <span>Доставка за 30 минут или пицца бесплатно</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1" />
                    <span>Свежее тесто собственного приготовления</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1" />
                    <span>Программа лояльности с накопительными баллами</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1" />
                    <span>Бесплатная доставка от 1000₽</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 'delivery':
        return (
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold mb-8">Доставка и оплата</h1>
            <Card>
              <CardHeader>
                <CardTitle>Условия доставки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Время доставки</h3>
                  <p>Мы доставляем пиццу за 30-40 минут. Если не успеваем за 30 минут - пицца бесплатно!</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Стоимость доставки</h3>
                  <ul className="space-y-2 ml-4">
                    <li>• От 1000₽ - бесплатно</li>
                    <li>• От 500₽ до 999₽ - 150₽</li>
                    <li>• До 499₽ - 200₽</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Зона доставки</h3>
                  <p>Мы доставляем в пределах 5 км от наших пиццерий.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Способы оплаты</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Icon name="CreditCard" className="text-primary mt-1" />
                    <span>Банковской картой курьеру</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="Wallet" className="text-primary mt-1" />
                    <span>Наличными курьеру</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="Smartphone" className="text-primary mt-1" />
                    <span>Онлайн при оформлении заказа</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 'contacts':
        return (
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold mb-8">Контакты</h1>
            <Card>
              <CardHeader>
                <CardTitle>Свяжитесь с нами</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon name="Phone" className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Телефон</p>
                    <p className="text-muted-foreground">+7 (800) 555-35-35</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Mail" className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground">info@pizzamchitsya.ru</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="MapPin" className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Адрес</p>
                    <p className="text-muted-foreground">г. Москва, ул. Примерная, д. 123</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Clock" className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Режим работы</p>
                    <p className="text-muted-foreground">Ежедневно с 10:00 до 23:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'reviews':
        return (
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold mb-8">Отзывы</h1>
            <div className="space-y-4">
              {reviews.map(review => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{review.name}</CardTitle>
                        <CardDescription>{review.date}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={16}
                            className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{review.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'account':
        if (!user) {
          return (
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Войдите в систему</CardTitle>
                  <CardDescription>
                    Авторизуйтесь, чтобы получить доступ к личному кабинету, истории заказов и программе лояльности
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center py-8">
                    <div className="text-6xl mb-4">🔐</div>
                    <p className="text-center text-muted-foreground mb-6">
                      Войдите с помощью номера телефона и получайте бонусы за каждый заказ
                    </p>
                    <Button size="lg" onClick={() => setIsAuthOpen(true)}>
                      <Icon name="LogIn" className="mr-2" />
                      Войти в систему
                    </Button>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-semibold">Преимущества регистрации:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Icon name="Check" className="text-primary mt-1" size={16} />
                        <span>Копите баллы и получайте скидки</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="Check" className="text-primary mt-1" size={16} />
                        <span>История всех ваших заказов</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="Check" className="text-primary mt-1" size={16} />
                        <span>Быстрое оформление повторных заказов</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="Check" className="text-primary mt-1" size={16} />
                        <span>Специальные предложения и акции</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        }
        
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold mb-8">Личный кабинет</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Программа лояльности</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Ваши баллы</p>
                    <p className="text-4xl font-bold text-primary">{user?.loyaltyPoints || 0}</p>
                    <p className="text-sm text-muted-foreground mt-2">1 балл = 1₽ скидки</p>
                  </div>
                  <div className="text-6xl">🎁</div>
                </div>
                <div className="mt-6 space-y-2">
                  <p className="text-sm font-semibold">Как накапливать баллы:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• За каждые 100₽ заказа - 1 балл</li>
                    <li>• Пригласи друга - 50 баллов</li>
                    <li>• День рождения - 100 баллов в подарок</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>История заказов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user?.orders && user.orders.length > 0 ? (
                    user.orders.map(order => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold">Заказ №{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                          <Badge variant={order.status === 'Доставлено' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          {order.items.map(item => (
                            <div key={item.id} className="flex justify-between">
                              <span>{item.name} x{item.quantity}</span>
                              <span>{item.price * item.quantity}₽</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-3" />
                        <div className="flex justify-between font-semibold">
                          <span>Итого:</span>
                          <span>{order.total}₽</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">У вас пока нет заказов</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Мои данные</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Имя</p>
                  <p className="font-semibold">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Телефон</p>
                  <p className="font-semibold">{user?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>
                <Separator />
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <Icon name="LogOut" className="mr-2" size={16} />
                  Выйти из аккаунта
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => setCurrentPage('home')} className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
              🍕 Пицца Мчится
            </button>
            <nav className="hidden md:flex gap-6">
              <button onClick={() => setCurrentPage('home')} className="text-sm font-medium hover:text-primary transition-colors">
                Главная
              </button>
              <button onClick={() => setCurrentPage('menu')} className="text-sm font-medium hover:text-primary transition-colors">
                Меню
              </button>
              <button onClick={() => setCurrentPage('about')} className="text-sm font-medium hover:text-primary transition-colors">
                О нас
              </button>
              <button onClick={() => setCurrentPage('delivery')} className="text-sm font-medium hover:text-primary transition-colors">
                Доставка
              </button>
              <button onClick={() => setCurrentPage('contacts')} className="text-sm font-medium hover:text-primary transition-colors">
                Контакты
              </button>
              <button onClick={() => setCurrentPage('reviews')} className="text-sm font-medium hover:text-primary transition-colors">
                Отзывы
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Icon name="Menu" size={24} />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={20} />
            </Button>
            
            {user ? (
              <Button variant="ghost" size="icon" onClick={() => setCurrentPage('account')}>
                <Icon name="User" size={20} />
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={() => setIsAuthOpen(true)}>
                <Icon name="LogIn" className="mr-2" size={16} />
                Войти
              </Button>
            )}

            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  <ScrollArea className="flex-1 -mx-6 px-6 my-4">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-muted-foreground">Корзина пуста</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map(item => (
                          <div key={item.id} className="flex gap-4 border rounded-lg p-4">
                            <div className="w-20 h-20 overflow-hidden rounded-lg flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.name}{item.size ? ` (${item.size}см)` : ''}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{item.price}₽</p>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Icon name="Minus" size={14} />
                                </Button>
                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Icon name="Plus" size={14} />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Icon name="Trash2" size={16} />
                              </Button>
                              <span className="font-bold">{item.price * item.quantity}₽</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  
                  {cart.length > 0 && (
                    <div className="space-y-4 border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span>Бонусов к начислению:</span>
                        <span className="font-semibold text-primary">+{loyaltyPointsEarned}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Итого:</span>
                        <span>{cartTotal}₽</span>
                      </div>
                      <Button className="w-full" size="lg" onClick={() => setIsCheckoutOpen(true)}>
                        Оформить заказ
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>

      <footer className="border-t mt-16 py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Пицца Мчится</h3>
              <p className="text-sm text-muted-foreground">
                Лучшая итальянская пицца с доставкой за 30 минут
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Контакты</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>+7 (800) 555-35-35</p>
                <p>info@pizzamchitsya.ru</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Режим работы</h3>
              <p className="text-sm text-muted-foreground">
                Ежедневно с 10:00 до 23:00
              </p>
            </div>
          </div>
          <Separator className="my-6" />
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Пицца Мчится. Все права защищены.
          </p>
        </div>
      </footer>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px]">
          <SheetHeader>
            <SheetTitle className="text-left">Меню</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 mt-6">
            <button
              onClick={() => {
                setCurrentPage('home');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-4 rounded-lg hover:bg-secondary transition-colors flex items-center gap-3"
            >
              <Icon name="Home" size={20} />
              <span>Главная</span>
            </button>
            <button
              onClick={() => {
                setCurrentPage('menu');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-4 rounded-lg hover:bg-secondary transition-colors flex items-center gap-3"
            >
              <Icon name="Pizza" size={20} />
              <span>Меню</span>
            </button>
            <button
              onClick={() => {
                setCurrentPage('about');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-4 rounded-lg hover:bg-secondary transition-colors flex items-center gap-3"
            >
              <Icon name="Info" size={20} />
              <span>О нас</span>
            </button>
            <button
              onClick={() => {
                setCurrentPage('delivery');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-4 rounded-lg hover:bg-secondary transition-colors flex items-center gap-3"
            >
              <Icon name="Truck" size={20} />
              <span>Доставка</span>
            </button>
            <button
              onClick={() => {
                setCurrentPage('contacts');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-4 rounded-lg hover:bg-secondary transition-colors flex items-center gap-3"
            >
              <Icon name="Phone" size={20} />
              <span>Контакты</span>
            </button>
            <button
              onClick={() => {
                setCurrentPage('reviews');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-4 rounded-lg hover:bg-secondary transition-colors flex items-center gap-3"
            >
              <Icon name="MessageSquare" size={20} />
              <span>Отзывы</span>
            </button>
            <Separator className="my-2" />
            <button
              onClick={() => {
                setCurrentPage('account');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-4 rounded-lg hover:bg-secondary transition-colors flex items-center gap-3"
            >
              <Icon name="User" size={20} />
              <span>Личный кабинет</span>
            </button>
          </nav>
        </SheetContent>
      </Sheet>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
            <DialogDescription>
              Заполните данные для доставки
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Имя *</Label>
                <Input
                  id="name"
                  value={orderForm.name}
                  onChange={e => setOrderForm({ ...orderForm, name: e.target.value })}
                  placeholder="Введите ваше имя"
                />
              </div>
              <div>
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  value={orderForm.phone}
                  onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                  placeholder="+7 999 999-99-99"
                />
              </div>
            </div>

            <Separator />

            <div>
              <Label className="mb-3 block">Способ получения *</Label>
              <RadioGroup value={deliveryMethod} onValueChange={(v) => setDeliveryMethod(v as 'delivery' | 'pickup')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="cursor-pointer">Доставка</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="cursor-pointer">Самовывоз</Label>
                </div>
              </RadioGroup>
            </div>

            {deliveryMethod === 'delivery' && (
              <div>
                <Label htmlFor="address">Адрес доставки *</Label>
                <Input
                  id="address"
                  value={orderForm.address}
                  onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                  placeholder="Улица, дом, квартира"
                />
              </div>
            )}

            <Separator />

            <div>
              <Label className="mb-3 block">Способ оплаты *</Label>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'card' | 'cash' | 'online')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">Картой курьеру</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="cursor-pointer">Наличными</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="cursor-pointer">Онлайн оплата</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="comment">Комментарий к заказу</Label>
              <Textarea
                id="comment"
                value={orderForm.comment}
                onChange={e => setOrderForm({ ...orderForm, comment: e.target.value })}
                placeholder="Дополнительные пожелания"
                rows={3}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Сумма заказа:</span>
                <span className="font-semibold">{cartTotal}₽</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Бонусов к начислению:</span>
                <span className="text-primary font-semibold">+{loyaltyPointsEarned}</span>
              </div>
              {deliveryMethod === 'delivery' && cartTotal < 1000 && (
                <div className="flex justify-between text-sm">
                  <span>Доставка:</span>
                  <span>{cartTotal >= 500 ? '150₽' : '200₽'}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span>
                  {deliveryMethod === 'delivery' && cartTotal < 1000
                    ? cartTotal + (cartTotal >= 500 ? 150 : 200)
                    : cartTotal}₽
                </span>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Подтвердить заказ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Вход в систему</DialogTitle>
            <DialogDescription>
              Введите ваш номер телефона для входа или регистрации
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="authPhone">Номер телефона *</Label>
              <Input
                id="authPhone"
                type="tel"
                value={authPhone}
                onChange={e => setAuthPhone(e.target.value)}
                placeholder="+7 999 999-99-99"
              />
            </div>

            <Button className="w-full" size="lg" onClick={handleLogin}>
              <Icon name="LogIn" className="mr-2" size={16} />
              Войти
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              При входе вы автоматически соглашаетесь с условиями использования и программой лояльности
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PizzaShop;