import { motion } from "framer-motion"
import { BsArrowRight, BsStars } from "react-icons/bs"

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
  
export default function HeroSection() {
    return (
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
    )
}