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

export default function TestmonialsSection() {
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
  )
}


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