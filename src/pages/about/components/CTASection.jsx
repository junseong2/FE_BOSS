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

  
export default function CTASection() {
    return (
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
    )
}