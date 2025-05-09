import { motion } from "framer-motion"
import {  FiCheckCircle } from "react-icons/fi"


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
  
export default function PricingSection() {
    return (
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
    )
}

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