import { useState, useEffect } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiFilter,
  FiX,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  // Sample product categories
  const categories = [
    "all",
    "furniture",
    "appliances",
    "decor",
    "kitchen",
    "bathroom",
    "bedroom",
    "outdoor",
  ];

  // Fetch products (simulated)
  useEffect(() => {
    // Simulate API call to fetch products
    setTimeout(() => {
      const sampleProducts = Array(12)
        .fill()
        .map((_, index) => ({
          id: index + 1,
          name: `Home Product ${index + 1}`,
          category:
            categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
          price: Math.floor(Math.random() * 100000) + 5000,
          image: `https://source.unsplash.com/random/300x300/?home&sig=${index}`,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        }));
      setProducts(sampleProducts);
      setIsLoading(false);
    }, 1500);
  }, []);

  // Filter products based on search, category, and price
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Add to cart
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} added to cart!`);
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Aplet360 Marketplace
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Shop quality home products and furnishings for your apartment
          </p>
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-300 text-tertiary-800"
              />
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-6 rounded-r-md flex items-center">
                <FiSearch className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Toggle Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full shadow-lg z-40"
      >
        <FiShoppingCart className="h-6 w-6" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>
    </div>
  );
}
