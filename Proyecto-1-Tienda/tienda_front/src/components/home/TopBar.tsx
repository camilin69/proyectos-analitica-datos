import logo from '../../assets/logo.png';
import meli from '../../assets/meli.webp';
import { FaHeart } from 'react-icons/fa';
import { VscChevronDown } from "react-icons/vsc";
import { PiShoppingCartThin } from "react-icons/pi";
import { GoBell } from 'react-icons/go';
import { CiLocationOn } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { User, Address } from '../../types/user';

interface TopBarProps {
  user: User | null;
  onLogout: () => void;
}

interface CategoryItem {
  name: string;
  href: string;
}

interface ProfileOption {
  name: string;
  href?: string;
  action?: () => void;
  isLogout?: boolean;
  isHeader?: boolean;
  isSeparator?: boolean;
}

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

function TopBar({ user, onLogout }: TopBarProps) {
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  
  const [categoriesArrowPosition, setCategoriesArrowPosition] = useState<number>(16);
  const [profileArrowPosition, setProfileArrowPosition] = useState<number>(16);
  const [favoritesArrowPosition, setFavoritesArrowPosition] = useState<number>(16);
  
  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoriesButtonRef = useRef<HTMLDivElement>(null);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLDivElement>(null);
  
  const favoritesRef = useRef<HTMLDivElement>(null);
  const favoritesButtonRef = useRef<HTMLDivElement>(null);

  const getFirstName = (fullName: string | undefined): string => {
    if (!fullName) return 'Usuario';
    return fullName.split(' ')[0];
  };

  // Datos para el menú de categorías
  const categories: CategoryItem[] = [
    { name: 'Electrónicos', href: '/category/electronics' },
    { name: 'Ropa y Accesorios', href: '/category/clothing' },
    { name: 'Hogar', href: '/category/home' },
    { name: 'Deportes', href: '/category/sports' },
    { name: 'Libros', href: '/category/books' },
    { name: 'Belleza', href: '/category/beauty' },
    { name: 'Juguetes', href: '/category/toys' },
    { name: 'Automotriz', href: '/category/automotive' }
  ];

  // Datos para el menú de perfil
  // Datos para el menú de perfil
  const profileOptions: ProfileOption[] = [
    // Header con avatar y nombre
    { 
      name: 'header', 
      href: '/profile',
      isHeader: true 
    },
    // Separador
    { name: 'separator-1' },
    // Opciones principales
    { name: 'Compras', href: '/purchases' },
    { name: 'Ventas', href: '/sales' },
    { name: 'Publicaciones', href: '/publications' },
    // Separador
    { name: 'separator-2' },
    // Más opciones
    { name: 'Historial', href: '/history' },
    { name: 'Preguntas', href: '/questions' },
    { name: 'Opiniones', href: '/reviews' },
    { name: 'Suscripciones', href: '/subscriptions' },
    // Separador
    { name: 'separator-3' },
    // Opciones administrativas
    { name: 'Resumen', href: '/summary' },
    { name: 'Postventa', href: '/aftersale' },
    { name: 'Reputación', href: '/reputation' },
    { name: 'Publicidad', href: '/advertising' },
    { name: 'Mi página', href: '/mypage' },
    { name: 'Métricas', href: '/metrics' },
    { name: 'Facturación', href: '/billing' },
    // Separador final
    { name: 'separator-4' },
    { name: 'Salir', action: onLogout, isLogout: true }
  ];

  // Datos para el menú de favoritos (simulado)
  const favoriteProducts: FavoriteProduct[] = [
    { id: '1', name: 'iPhone 15 Pro', price: 999.99, image: 'https://via.placeholder.com/40/3B82F6/FFFFFF?text=IP' },
    { id: '2', name: 'Laptop Gaming', price: 1299.99, image: 'https://via.placeholder.com/40/EF4444/FFFFFF?text=LP' },
    { id: '3', name: 'Audífonos Bluetooth', price: 199.99, image: 'https://via.placeholder.com/40/10B981/FFFFFF?text=AU' }
  ];

  const formatAddress = (address: Address | string | undefined): string => {
    if (!address) return 'Agregar dirección1';
    
    // Si la dirección es un string, retornarla directamente
    if (typeof address === 'string') return address;
    
    // Si es un objeto Address, formatearlo
    const { street, city } = address;
    if (street && city) {
      return `${street}, ${city}`;
    }
    return 'Agregar dirección';
  };

  // Calcular posición de todos los dropdowns
  useEffect(() => {
    // Dropdown de Categorías
    if (showCategories && categoriesButtonRef.current && categoriesRef.current) {
      const button = categoriesButtonRef.current;
      const dropdown = categoriesRef.current;
      const buttonRect = button.getBoundingClientRect();
      
      dropdown.style.left = `${buttonRect.left}px`;
      dropdown.style.top = `${buttonRect.bottom}px`;
      
      const buttonWidth = buttonRect.width;
      const chevronPosition = buttonWidth * 0.92;
      setCategoriesArrowPosition(chevronPosition - 8);
    }

    // Dropdown de Perfil
    if (showProfile && profileButtonRef.current && profileRef.current) {
      const button = profileButtonRef.current;
      const dropdown = profileRef.current;
      const buttonRect = button.getBoundingClientRect();
      
      dropdown.style.left = `${buttonRect.left}px`;
      dropdown.style.top = `${buttonRect.bottom}px`;
      
      const buttonWidth = buttonRect.width;
      const chevronPosition = buttonWidth * 0.90;
      setProfileArrowPosition(chevronPosition - 8);
    }

    // Dropdown de Favoritos
    if (showFavorites && favoritesButtonRef.current && favoritesRef.current) {
      const button = favoritesButtonRef.current;
      const dropdown = favoritesRef.current;
      const buttonRect = button.getBoundingClientRect();
      
      dropdown.style.left = `${buttonRect.left}px`;
      dropdown.style.top = `${buttonRect.bottom}px`;
      
      const buttonWidth = buttonRect.width;
      const chevronPosition = buttonWidth * 0.91;
      setFavoritesArrowPosition(chevronPosition - 8);
    }
  }, [showCategories, showProfile, showFavorites]);

  return (
    <div className="bg-yellow-500 relative h-[100px]">
      <div className="max-w-6xl mx-auto">
        {/* Primera fila */}
        <div className="grid grid-cols-12 gap-4 items-center pt-2">
          <div className="col-span-2 flex justify-start">
            <Link to="/">
              <img src={logo} alt="Logo" className="w-[134px] h-[34px]" />
            </Link>
          </div>
          
          <div className="col-span-6 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <input
                  type="text"
                  placeholder="Buscar productos, marcas y más..."
                  className="w-full p-2 pl-4 bg-white border rounded-[2px] border-gray-300 focus:outline-none focus:border-blue-500 shadow-sm"
              />
              <button className="absolute right-0 top-1/2 transform -translate-y-1/2 h-3/4 border-l border-l-gray-300 px-4 cursor-pointer">
                <IoSearchOutline className='text-[23px] text-gray-500' />
              </button>
            </div>
          </div>
          
          <div className="col-span-4 flex justify-end">
            <a className="flex items-center text-sm hover:text-gray-500 transition duration-200">
              <img src={meli} alt="Colombia" className="w-80 h-full" />
            </a>
          </div>
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-12 gap-4 items-center py-2">
          <div className="col-span-2 flex">
            <a className="flex items-start hover:text-gray-500 transition duration-200 w-full">
              <div className="flex-shrink-0 mr-2 mt-0.5">
                <CiLocationOn className="text-black text-[27px]" />
              </div>
              
              <div className="flex flex-col whitespace-nowrap overflow-hidden">
                <span className="text-xs leading-tight text-gray-600">Enviar a {getFirstName(user?.name)}</span>
                <span className="flex-shrink-0 text-sm leading-tight truncate min-w-0">
                  {formatAddress(user?.address)}
                </span>
              </div>
            </a>
          </div>
          
          {/* Nav Area - Categorías y enlaces de navegación */}
          <nav className="col-span-6 flex items-center space-x-2 min-w-0">
            {/* Contenedor del menú categorías */}
            <div 
              className="relative flex-shrink-0"
              ref={categoriesButtonRef}
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="flex items-center space-x-1 text-sm hover:text-gray-700 transition duration-200 py-1 h-8 bg-yellow-500 border-yellow-500 rounded hover:bg-yellow-400 whitespace-nowrap">
                <span>Categorías</span>
                <VscChevronDown  className={`text-xs transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {/* Enlaces de navegación - SIN SCROLL HORIZONTAL */}
            <div className="flex items-center flex-1 min-w-0 overflow-hidden">
              <a href="/offers" className="whitespace-nowrap text-sm hover:text-gray-700 transition duration-200 px-2 py-1 h-8 flex items-center flex-shrink-0">
                Ofertas
              </a>
              <a href="/coupons" className="whitespace-nowrap text-sm hover:text-gray-700 transition duration-200 px-2 py-1 h-8 flex items-center flex-shrink-0">
                Cupones
              </a>
              <a href="/supermarket" className="whitespace-nowrap text-sm hover:text-gray-700 transition duration-200 px-2 py-1 h-8 flex items-center flex-shrink-0">
                Supermercado
              </a>
              <a href="/fashion" className="whitespace-nowrap text-sm hover:text-gray-700 transition duration-200 px-2 py-1 h-8 flex items-center flex-shrink-0">
                Moda
              </a>
              <Link to="/sell" className="whitespace-nowrap text-sm hover:text-gray-700 transition duration-200 px-2 py-1 h-8 flex items-center flex-shrink-0">
                Vender
              </Link>
              <a href="/help" className="whitespace-nowrap text-sm hover:text-gray-700 transition duration-200 px-2 py-1 h-8 flex items-center flex-shrink-0">
                Ayuda / PQR
              </a>
            </div>
          </nav>
          
          {/* Nav Header - Perfil y utilidades */}
          <nav className="col-span-4 flex items-center justify-end space-x-2 min-w-0">
            {/* Menú desplegable de Perfil */}
            <div className="relative flex-shrink-0">
              <div 
                className="relative"
                ref={profileButtonRef}
                onMouseEnter={() => setShowProfile(true)}
                onMouseLeave={() => setShowProfile(false)}
              >
                <button className="cursor-pointer flex items-center space-x-[2px] text-sm hover:text-gray-700 transition duration-200 py-1 h-8 bg-yellow-500 border-yellow-500 rounded pl-1 pr-2 min-w-0 max-w-[120px]">
                  {/* Avatar circular */}
                  <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden border border-gray-400 flex-shrink-0">
                    {user?.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-400 flex items-center justify-center text-xs text-white">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  
                  <span className='truncate min-w-0 flex-1'>{getFirstName(user?.name)}</span>
                  <VscChevronDown className={`text-xs transition-transform duration-200 flex-shrink-0 ${showProfile ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            
            <a href="" className="text-sm hover:text-gray-700 transition duration-200 whitespace-nowrap py-1 h-8 flex items-center flex-shrink-0">
              Mis compras
            </a>
            
            <div className="flex items-center flex-shrink-0 space-x-4">
              {/* Menú desplegable de Favoritos */}
              <div className="relative flex-shrink-0">
                <div 
                  className="relative"
                  ref={favoritesButtonRef}
                  onMouseEnter={() => setShowFavorites(true)}
                  onMouseLeave={() => setShowFavorites(false)}
                >
                  <button className="flex items-center text-sm hover:text-gray-700 transition duration-200 py-1 h-8 bg-yellow-500 border-yellow-500 rounded hover:bg-yellow-400 whitespace-nowrap">
                    <span className='px-[2px]'>Favoritos</span>
                    <VscChevronDown  className={`text-xs transition-transform duration-200 ${showFavorites ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              
              <a className="cursor-pointer rounded transition duration-200 flex items-center justify-center">
                <GoBell className="text-black-500 text-[22px] hover:text-black-100" />
              </a>
              <a className="cursor-pointer rounded transition duration-200 flex items-center justify-center">
                <PiShoppingCartThin  className="text-black-500 text-[22px] hover:text-black-100" />
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* DROPDOWN DE CATEGORÍAS */}
      {showCategories && (
        <div 
          ref={categoriesRef}
          className="fixed z-50 bg-white rounded-md shadow-lg border border-gray-200 w-48"
          onMouseEnter={() => setShowCategories(true)}
          onMouseLeave={() => setShowCategories(false)}
        >
          <div 
            className="absolute w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"
            style={{
              top: '-8px',
              left: `${categoriesArrowPosition}px`
            }}
          ></div>
          
          <div className="relative bg-white rounded-md py-1 z-10">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
                onClick={() => setShowCategories(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* DROPDOWN DE PERFIL */}
      {showProfile && (
        <div 
          ref={profileRef}
          className="fixed z-50 bg-white rounded-md shadow-lg border border-gray-200 w-64"
          onMouseEnter={() => setShowProfile(true)}
          onMouseLeave={() => setShowProfile(false)}
        >
          <div 
            className="absolute w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"
            style={{
              top: '-8px',
              left: `${profileArrowPosition}px`
            }}
          ></div>
          
          <div className="relative bg-white rounded-md">
            {profileOptions.map((option, index) => {
              // Header con avatar y nombre
              if (option.isHeader) {
                return (
                  <Link
                    key="profile-header"
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition duration-150 border-b border-gray-100"
                    onClick={() => setShowProfile(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border border-gray-400 flex-shrink-0">
                      {user?.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-400 flex items-center justify-center text-sm font-semibold text-white">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-900 truncate">
                        {getFirstName(user?.name)}
                      </p>
                      <div className="flex items-center space-x-1">
                        <p className="text-sm text-gray-500 truncate">Mi perfil</p>
                        <VscChevronDown className="text-sm text-gray-500 flex-shrink-0 rotate-270" />
                      </div>
                    </div>
                  </Link>
                );
              }
              
              // Separador
              if (option.name.startsWith('separator')) {
                return (
                  <div key={option.name} className="border-t border-gray-200"></div>
                );
              }
              
              // Opción de logout
              if (option.action) {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      option.action!();
                      setShowProfile(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition duration-150 ${
                      option.isLogout 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option.name}
                  </button>
                );
              }
              
              // Opción normal
              return (
                <Link
                  key={index}
                  to={option.href!}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
                  onClick={() => setShowProfile(false)}
                >
                  {option.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* DROPDOWN DE FAVORITOS */}
      {showFavorites && (
        <div 
          ref={favoritesRef}
          className="fixed z-50 bg-white rounded-md shadow-lg border border-gray-200 w-80"
          onMouseEnter={() => setShowFavorites(true)}
          onMouseLeave={() => setShowFavorites(false)}
        >
          <div 
            className="absolute w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"
            style={{
              top: '-8px',
              left: `${favoritesArrowPosition}px`
            }}
          ></div>
          
          <div className="relative bg-white rounded-md max-h-96 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <FaHeart className="text-red-500" />
                <span>Mis Favoritos</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">{favoriteProducts.length} productos guardados</p>
            </div>

            {/* Lista de favoritos */}
            <div className="max-h-64 overflow-y-auto">
              {favoriteProducts.length === 0 ? (
                <div className="text-center py-8">
                  <FaHeart className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No tienes favoritos aún</p>
                  <Link 
                    to="/"
                    className="text-blue-600 hover:text-blue-800 text-sm inline-block mt-2"
                    onClick={() => setShowFavorites(false)}
                  >
                    Descubrir productos
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {favoriteProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/producto/${product.id}`}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 transition duration-150 group"
                      onClick={() => setShowFavorites(false)}
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm font-semibold text-green-600">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log(`Eliminar favorito: ${product.id}`);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
                        title="Eliminar de favoritos"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {favoriteProducts.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <Link 
                  to="/favorites"
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 text-sm"
                  onClick={() => setShowFavorites(false)}
                >
                  Ver todos los favoritos
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TopBar;