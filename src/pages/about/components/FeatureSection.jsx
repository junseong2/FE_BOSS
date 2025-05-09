import { motion } from "framer-motion"
import { FiSettings, FiUsers, FiLayers } from "react-icons/fi"
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
  
export default function FeatureSection() {
    return (
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
    )
}


const FeatureCard = ({ icon, title, description }) => {
    return (
      <motion.div variants={fadeIn} className="bg-white p-6 rounded-md border border-gray-100 transition-all">
        <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center text-[#2B7FFF] mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </motion.div>
    )
  }
  