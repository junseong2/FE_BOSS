import { motion } from "framer-motion"

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
  
export default function HowItWorksSection() {
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
    )
}



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