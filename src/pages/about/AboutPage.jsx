
import { motion } from "framer-motion"
import { FiSettings, FiUsers, FiLayers, FiCheckCircle } from "react-icons/fi"
import { BsArrowRight, BsStars } from "react-icons/bs"
import { RiStore2Line, RiPaintBrushLine, RiRocketLine } from "react-icons/ri"


const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}


function AboutPage() {
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-white pt-24 pb-36">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-blue-50 opacity-60 blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeIn} className="inline-block mb-4 px-4 py-1 bg-blue-100 rounded-full">
              <span className="text-[#2B7FFF] font-medium flex items-center">
                <BsStars className="mr-2" /> 노코드로 쇼핑몰을 쉽게 구축하세요
              </span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-semibold mb-8 leading-tight">
              코딩 없이 <span className="text-[#2B7FFF]">전문적인 쇼핑몰</span>을 만들어보세요
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              복잡한 코딩 지식 없이도 몇 분 안에 맞춤형 온라인 쇼핑몰을 구축하고 관리할 수 있습니다. 드래그 앤 드롭으로
              쉽게 시작하세요.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-3.5 bg-[#2B7FFF] text-white rounded-md font-medium hover:bg-blue-600 transition-all flex items-center justify-center">
                무료로 시작하기 <BsArrowRight className="ml-2" />
              </button>
              <button className="px-8 py-3.5 bg-white border border-gray-200 rounded-md font-medium hover:bg-gray-50 transition-all">
                데모 보기
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative"
          >
            <div className="bg-white p-1 rounded-md border border-gray-100">
              <img
                src='https://picsum.photos/768/512'
                alt="쇼핑몰 대시보드 미리보기"
                className="w-full rounded-md"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[#2B7FFF] text-white px-5 py-2 rounded-md">
              <span className="font-medium">드래그 앤 드롭으로 쉽게 구축</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-semibold mb-4">
              모든 기능을 <span className="text-[#2B7FFF]">한 곳에서</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-gray-600 max-w-3xl mx-auto">
              쇼핑몰 구축에 필요한 모든 도구와 기능을 제공합니다
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={<RiStore2Line size={24} />}
              title="쉬운 상점 구축"
              description="드래그 앤 드롭 인터페이스로 몇 분 안에 전문적인 쇼핑몰을 만들 수 있습니다."
            />
            <FeatureCard
              icon={<FiLayers size={24} />}
              title="다양한 템플릿"
              description="수백 가지 맞춤형 템플릿으로 원하는 디자인을 쉽게 적용하세요."
            />
            <FeatureCard
              icon={<FiSettings size={24} />}
              title="강력한 관리 도구"
              description="주문, 재고, 고객 관리를 한 곳에서 효율적으로 처리하세요."
            />
            <FeatureCard
              icon={<RiPaintBrushLine size={24} />}
              title="맞춤형 디자인"
              description="브랜드에 맞는 색상, 폰트, 레이아웃을 자유롭게 커스터마이징하세요."
            />
            <FeatureCard
              icon={<FiUsers size={24} />}
              title="고객 관리"
              description="고객 데이터를 분석하고 개인화된 마케팅을 쉽게 구현하세요."
            />
            <FeatureCard
              icon={<RiRocketLine size={24} />}
              title="빠른 성장 지원"
              description="SEO 최적화, 소셜 미디어 통합으로 온라인 비즈니스를 성장시키세요."
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-[#2B7FFF]">어떻게</span> 작동하나요?
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-gray-600 max-w-3xl mx-auto">
              단 3단계로 쉽게 쇼핑몰을 구축하고 운영할 수 있습니다
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <StepCard
              number="01"
              title="템플릿 선택"
              description="다양한 업종별 템플릿 중에서 원하는 디자인을 선택하세요."
            />
            <StepCard
              number="02"
              title="맞춤 설정"
              description="로고, 색상, 제품을 추가하고 원하는 대로 커스터마이징하세요."
            />
            <StepCard
              number="03"
              title="출시 및 성장"
              description="쇼핑몰을 출시하고 통합된 마케팅 도구로 비즈니스를 성장시키세요."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <button className="px-8 py-4 bg-[#2B7FFF] text-white rounded-lg font-medium hover:bg-blue-600 transition-all">
              지금 시작하기
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              고객들의 <span className="text-[#2B7FFF]">성공 사례</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-gray-600 max-w-3xl mx-auto">
              실제 사용자들의 경험을 확인해보세요
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <TestimonialCard
              quote="코딩 지식 없이도 일주일 만에 전문적인 쇼핑몰을 오픈했어요. 매출이 3배 증가했습니다!"
              author="김지영"
              company="패션 부티크 운영자"
            />
            <TestimonialCard
              quote="관리가 너무 쉽고 직관적이에요. 이제 제품 등록부터 주문 관리까지 모든 것이 간편해졌습니다."
              author="이상호"
              company="전자제품 판매점"
            />
            <TestimonialCard
              quote="맞춤형 디자인 덕분에 브랜드 아이덴티티를 완벽하게 표현할 수 있었어요. 고객 반응이 놀랍습니다."
              author="박미라"
              company="수제 화장품 브랜드"
            />
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-[#2B7FFF]">합리적인</span> 가격 플랜
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-gray-600 max-w-3xl mx-auto">
              비즈니스 규모에 맞는 플랜을 선택하세요
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <PricingCard
              title="스타터"
              price="19,900"
              features={["기본 템플릿 10개", "월 100개 제품 등록", "기본 분석 도구", "이메일 지원"]}
              isPopular={false}
            />
            <PricingCard
              title="프로"
              price="49,900"
              features={["프리미엄 템플릿 50개", "무제한 제품 등록", "고급 분석 도구", "우선 지원", "마케팅 도구 통합"]}
              isPopular={true}
            />
            <PricingCard
              title="비즈니스"
              price="99,900"
              features={[
                "모든 템플릿 이용 가능",
                "무제한 제품 등록",
                "고급 분석 및 AI 추천",
                "24/7 전담 지원",
                "맞춤형 기능 개발",
              ]}
              isPopular={false}
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#2B7FFF] to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-semibold mb-6">
              지금 바로 노코드 쇼핑몰을 시작하세요
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl mb-8 opacity-90">
              14일 무료 체험으로 시작하고, 온라인 비즈니스를 성장시키세요.
              <br />
              신용카드 정보가 필요하지 않습니다.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-3.5 bg-white text-[#2B7FFF] rounded-md font-medium hover:bg-gray-100 transition-all">
                무료로 시작하기
              </button>
              <button className="px-8 py-3.5 bg-transparent border border-white rounded-md font-medium hover:bg-white/10 transition-all">
                자세히 알아보기
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Component for feature cards
const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div variants={fadeIn} className="bg-white p-6 rounded-md border border-gray-100 transition-all">
      <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center text-[#2B7FFF] mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

// Component for step cards
const StepCard = ({ number, title, description }) => {
  return (
    <motion.div variants={fadeIn} className="bg-white p-6 rounded-md border border-gray-100 transition-all relative">
      <div className="absolute -top-3 -left-3 w-10 h-10 bg-[#2B7FFF] rounded-md flex items-center justify-center text-white font-medium">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 mt-6">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

// Component for testimonial cards
const TestimonialCard = ({ quote, author, company }) => {
  return (
    <motion.div variants={fadeIn} className="bg-white p-6 rounded-md border border-gray-100 transition-all">
      <div className="text-[#2B7FFF] mb-4">
        <FiCheckCircle size={20} />
      </div>
      <p className="text-gray-700 mb-6">{quote}</p>
      <div>
        <h4 className="font-semibold">{author}</h4>
        <p className="text-gray-500 text-sm">{company}</p>
      </div>
    </motion.div>
  )
}

// Component for pricing cards
const PricingCard = ({ title, price, features, isPopular }) => {
  return (
    <motion.div
      variants={fadeIn}
      className={`bg-white p-6 rounded-md border ${isPopular ? "border-[#2B7FFF]" : "border-gray-100"} transition-all relative`}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2B7FFF] text-white px-4 py-1 rounded-md text-sm font-medium">
          인기 플랜
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-3xl font-semibold">₩{price}</span>
        <span className="text-gray-500">/월</span>
      </div>
      <ul className="mb-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <FiCheckCircle className="text-[#2B7FFF] mr-2" size={16} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-2.5 rounded-md font-medium ${isPopular ? "bg-[#2B7FFF] text-white" : "bg-gray-50 text-gray-800 border border-gray-200"}`}
      >
        시작하기
      </button>
    </motion.div>
  )
}
export default AboutPage;
