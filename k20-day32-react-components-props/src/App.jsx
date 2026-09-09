import UserProfileCard from './components/UserProfileCard';
import ProductList from './components/ProductList';
import FaqList from './components/FaqList';
import './App.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Dữ liệu Bài 1: Users
const usersData = [
  {
    id: 1,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    fullName: 'Nguyễn Thu Trang',
    jobTitle: 'Frontend Engineer',
    isOnline: true,
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    fullName: 'Trần Minh Đức',
    jobTitle: 'Backend Developer',
    isOnline: false,
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
  },
];

// Dữ liệu Bài 2: Products
const productsData = [
  {
    id: 1,
    name: 'Bàn phím cơ Keychron K2 Pro',
    price: 2450000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    discountPercent: 15,
  },
  {
    id: 2,
    name: 'Chuột không dây MX Master 3S',
    price: 2190000,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    discountPercent: 0,
  },
  {
    id: 3,
    name: 'Tai nghe Sony WH-1000XM5',
    price: 7990000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    inStock: false,
    discountPercent: 20,
  },
  {
    id: 4,
    name: 'Màn hình Dell UltraSharp 27 inch',
    price: 13500000,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    discountPercent: 10,
  },
];

// Dữ liệu Bài 3: FAQs
const faqData = [
  {
    id: 1,
    question: 'Props trong React dùng để làm gì?',
    answer: 'Props (viết tắt của properties) giúp truyền dữ liệu đơn hướng từ component cha xuống component con, giữ cho dữ liệu dễ kiểm soát.',
    category: 'React',
    isHot: true,
  },
  {
    id: 2,
    question: 'Tại sao cần truyền prop "key" khi dùng .map()?',
    answer: 'React sử dụng key để nhận diện item nào đã thay đổi, được thêm hoặc bị xoá, từ đó tối ưu hoá thuật toán Reconciliation (Virtual DOM).',
    category: 'React Core',
    isHot: true,
  },
  {
    id: 3,
    question: 'Vite mang lại lợi ích gì so với Create React App (CRA)?',
    answer: 'Vite dùng ES Modules nguyên bản trong môi trường dev và esbuild giúp thời gian khởi động server cũng như Hot Module Replacement (HMR) nhanh hơn đáng kể.',
    category: 'Tooling',
    isHot: false,
  },
  {
    id: 4,
    question: 'CSS Modules giải quyết bài toán gì?',
    answer: 'CSS Modules tự động băm tên class (scoping), loại bỏ nguy cơ trùng lặp class CSS giữa các component trong dự án lớn.',
    category: 'Styling',
    isHot: false,
  },
];

function App() {
  const handleAddToCart = (productName, finalPrice) => {
    alert(`Đã thêm "${productName}" vào giỏ hàng với giá ${formatCurrency(finalPrice)}!`);
  };

  const handleSelectFaq = (id) => {
    const selected = faqData.find((item) => item.id === id);
    alert(`Bạn đã chọn FAQ #${id}: ${selected ? selected.question : ''}`);
  };

  return (
    <div className="main-wrapper">
      <div className="page-container">
        <h1 className="app-title">K20 - Day 32: React Components & Props</h1>

        {/* BÀI 1 */}
        <section className="exercise-section">
          <h2 className="section-title">Bài 1: User Profile Cards</h2>
          <div className="profile-grid">
            {usersData.map((user) => (
              <UserProfileCard
                key={user.id}
                avatar={user.avatar}
                fullName={user.fullName}
                jobTitle={user.jobTitle}
                isOnline={user.isOnline}
                skills={user.skills}
              />
            ))}
          </div>
        </section>

        {/* BÀI 2 */}
        <section className="exercise-section">
          <h2 className="section-title">Bài 2: Danh sách sản phẩm (ProductList)</h2>
          <ProductList products={productsData} onAddToCart={handleAddToCart} />
        </section>

        {/* BÀI 3 */}
        <section className="exercise-section">
          <h2 className="section-title">Bài 3: Hệ thống FAQ / Accordion</h2>
          <FaqList faqs={faqData} onSelectFaq={handleSelectFaq} />
        </section>
      </div>
    </div>
  );
}

export default App;