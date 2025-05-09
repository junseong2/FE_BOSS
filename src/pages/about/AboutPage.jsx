/**
 * @file AboutPage.tsx
 * @description
 * 이 컴포넌트는 사이트의 소개 페이지(AboutPage)를 위한 프로토타입입니다.
 * 현재는 전체적인 레이아웃과 섹션 구성만 정의되어 있으며,
 * 실제 콘텐츠로 구현이 될지는 미확정 상태입니다.
 * 
 * 구성 섹션:
 * - HeroSection: 페이지 상단의 인트로 영역
 * - FeatureSection: 서비스 주요 특징 소개
 * - HowItWorksSection: 서비스 이용 방법 설명
 * - TestmonialsSection: 사용자 후기
 * - PricingSection: 가격 정보
 * - CTASection: 행동 유도(Call to Action) 영역
 * 
 */

import HeroSection from "./components/HeroSection"
import FeatureSection from "./components/FeatureSection"
import TestmonialsSection from "./components/TestmonialsSection"
import HowItWorksSection from "./components/HowItWorksSection"
import PricingSection from "./components/PricingSection"
import CTASection from "./components/CTASection"

/**
 * 사이트 소개용 About 페이지 컴포넌트.
 * 전체 섹션 구성만 포함된 디자인 프로토타입
 */
function AboutPage() {
  return (
    <div className="font-sans text-gray-800">
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <TestmonialsSection />
      <PricingSection />
      <CTASection />
    </div>
  )
}

export default AboutPage;
