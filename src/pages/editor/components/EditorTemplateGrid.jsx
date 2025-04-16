import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function EditorTemplateGrid({ onSelectTemplate }) {
  const [showModal, setShowModal] = useState(false);

  const templates = [
    {
      id: 'template-1',
      name: '모던 쇼핑몰',
      description: '깔끔한 헤더와 상품 정렬 템플릿',
      preview: `${import.meta.env.VITE_BACKEND_URL}/uploads/template1.png`,
      elements: [{"type":"header","id":"el-1","layout":{"column":1,"columnSpan":8,"top":0},"properties":{"title":"Helinox","logoUrl":"/uploads/helinox.svg","menuItems":[{"title":"SHOP","url":"/shop/shopbrand.html?type=P&xcode=051","highlight":true},{"title":"STORY","url":"/board/board.html?code=helinox_image6"},{"title":"HCC","url":"/shop/page.html?id=2"}],"categories":[{"title":"THUNDERBOLT PROJECT","url":"/shop/shopbrand.html?type=Y&xcode=028"},{"title":"체어","url":"/shop/shopbrand.html?type=X&xcode=034"},{"title":"테이블","url":"/shop/shopbrand.html?type=X&xcode=035"},{"title":"코트","url":"/shop/shopbrand.html?type=X&xcode=036"},{"title":"텐트&쉐이드","url":"/shop/shopbrand.html?type=X&xcode=037"}],"backgroundColor":"#FFFFFF","fontFamily":"Noto Sans KR","fontSize":"15px","fontWeight":"bold","size":{"web":{"width":"100%","height":"70px"}},"borderBottom":"1px solid #EEEEEE"}},{"type":"banner","id":"el-2","layout":{"column":1,"columnSpan":8,"top":1265},"properties":{"title":"V-Tarp 4.0 Roof","subtitle":"합리적인 가격의 멋진 상품을 발견하세요","imageUrl":"/uploads/helinox2.jpg","backgroundColor":"#000000","size":{"web":{"width":"100%","height":"auto"}},"textColor":"#FFFFFF","overlayColor":"rgba(0,0,0,0.5)"}},{"type":"text","id":"el-6","layout":{"column":1,"columnSpan":8,"top":1026.7999877929688},"properties":{"content":"Helinox Special Promotion","fontSize":"48px","fontWeight":"700","color":"#000000","textAlign":"center","size":{"web":{"width":"98.67%","height":"120px"}},"fontFamily":"Noto Sans KR"}},{"type":"banner","id":"el-12","layout":{"column":1,"columnSpan":8,"top":1265},"properties":{"title":"V-Tarp 4.0 Roof","subtitle":"합리적인 가격의 멋진 상품을 발견하세요","imageUrl":"/uploads/helinox3.jpg","backgroundColor":"#000000","size":{"web":{"width":"100%","height":"auto"}},"textColor":"#FFFFFF","overlayColor":"rgba(0,0,0,0.5)"}},{"type":"grid","id":"el-3","layout":{"column":1,"columnSpan":8,"top":724},"properties":{"sortList":["전체","일간","주간","월간"],"title":"Pendleton X Helinox","columns":4,"size":{"web":{"width":"99.81%","height":"223px"}},"subtitle":"자연과 조화를 이루는 감각적인 디자인의 제품","items":[{"imageUrl":"/shopimages/helinox/0460010000012.jpg?1742282187","title":"Pendleton X Helinox Chair Two Home","price":"₩330,000"},{"imageUrl":"/shopimages/helinox/0460010000032.jpg?1742283450","title":"Pendleton X Helinox Table Side Storage S","price":"₩135,000"},{"imageUrl":"/shopimages/helinox/0460010000022.jpg?1742283093","title":"Pendleton X Helinox Chair Two Home","price":"Sold Out"},{"imageUrl":"/shopimages/helinox/0460010000042.jpg?1742283548","title":"Pendleton X Helinox Table Side Storage S","price":"₩135,000"}],"backgroundColor":"#FFFFFF","borderRadius":"0px"}},{"type":"image","id":"el-1743661829114-7lksk9","layout":{"column":1,"columnSpan":8,"top":267.00001525878906},"properties":{"imageUrl":"/uploads/helinox2.jpg","alt":"샘플 이미지","size":{"web":{"width":"99.81%","height":"72px"}}}}]
    },
    {
      id: 'template-2',
      name: '감성 쇼핑몰',
      description: '세련되고 깔끔한 헤더와 배너',
      preview: `${import.meta.env.VITE_BACKEND_URL}/uploads/template2.png`,
      elements: [{"type":"header","id":"el-1","layout":{"column":1,"columnSpan":8,"top":25},"properties":{"title":"Helinox","logoUrl":"/uploads/helinox.svg","menuItems":[{"title":"SHOP","url":"/shop/shopbrand.html?type=P&xcode=051","highlight":true},{"title":"STORY","url":"/board/board.html?code=helinox_image6"},{"title":"PRODUCTS","url":"/PRODUCTS"}],"categories":[{"title":"THUNDERBOLT PROJECT","url":"/shop/shopbrand.html?type=Y&xcode=028"},{"title":"체어","url":"/shop/shopbrand.html?type=X&xcode=034"},{"title":"테이블","url":"/shop/shopbrand.html?type=X&xcode=035"},{"title":"코트","url":"/shop/shopbrand.html?type=X&xcode=036"},{"title":"텐트&쉐이드","url":"/shop/shopbrand.html?type=X&xcode=037"}],"backgroundColor":"#FFFFFF","fontFamily":"Noto Sans KR","fontSize":"15px","fontWeight":"bold","size":{"web":{"width":"99.81%","height":"106px"}},"borderBottom":"1px solid #EEEEEE"}},{"type":"banner","id":"el-2","layout":{"column":1,"columnSpan":8,"top":258},"properties":{"title":"V-Tarp 4.0 Roof","subtitle":"합리적인 가격의 멋진 상품을 발견하세요","imageUrl":"/uploads/helinox3.jpg","backgroundColor":"#000000","size":{"web":{"width":"97.75%","height":"540px"}},"textColor":"#FFFFFF","overlayColor":"rgba(0,0,0,0.5)"}},{"type":"banner","id":"el-12","layout":{"column":1,"columnSpan":8,"top":258},"properties":{"title":"V-Tarp 4.0 Roof","subtitle":"합리적인 가격의 멋진 상품을 발견하세요","imageUrl":"/uploads/helinox3.jpg","backgroundColor":"#000000","size":{"web":{"width":"97.75%","height":"540px"}},"textColor":"#FFFFFF","overlayColor":"rgba(0,0,0,0.5)"}},{"type":"grid","id":"el-3","layout":{"column":1,"columnSpan":8,"top":1200.2222747802734},"properties":{"sortList":["전체","일간","주간","월간"],"title":"Pendleton X Helinox","columns":4,"size":{"web":{"width":"94.49%","height":"223px"}},"subtitle":"자연과 조화를 이루는 감각적인 디자인의 제품","items":[{"imageUrl":"/shopimages/helinox/0460010000012.jpg?1742282187","title":"Pendleton X Helinox Chair Two Home","price":"₩330,000"},{"imageUrl":"/shopimages/helinox/0460010000032.jpg?1742283450","title":"Pendleton X Helinox Table Side Storage S","price":"₩135,000"},{"imageUrl":"/shopimages/helinox/0460010000022.jpg?1742283093","title":"Pendleton X Helinox Chair Two Home","price":"Sold Out"},{"imageUrl":"/shopimages/helinox/0460010000042.jpg?1742283548","title":"Pendleton X Helinox Table Side Storage S","price":"₩135,000"}],"backgroundColor":"#FFFFFF","borderRadius":"0px"}},{"type":"image","id":"el-7","layout":{"column":1,"columnSpan":8,"top":2624.6666870117188},"properties":{"imageUrl":"/uploads/helinox2.jpg","alt":"샘플 이미지","size":{"web":{"width":"96.89%","height":"909px"}}}},{"type":"image","id":"el-7","layout":{"column":1,"columnSpan":8,"top":2624.6666870117188},"properties":{"imageUrl":"/uploads/helinox2.jpg","alt":"샘플 이미지","size":{"web":{"width":"96.89%","height":"909px"}},"borderRadius":"16px"}},{"type":"image","id":"el-7","layout":{"column":1,"columnSpan":8,"top":2624.6666870117188},"properties":{"imageUrl":"/uploads/helinox2.jpg","alt":"샘플 이미지","size":{"web":{"width":"96.89%","height":"909px"}}}},{"type":"image","id":"el-1744075920604-wvdfqc","layout":{"column":1,"columnSpan":2,"top":3218.6666870117188},"properties":{"imageUrl":"/uploads/2_el-1744075920604-wvdfqc.mp4","alt":"샘플 이미지","size":{"web":{"width":"24.61%","height":"418px"}}}},{"type":"image","id":"el-1744075959491-c7vrv2","layout":{"column":7,"columnSpan":2,"top":3237.6666870117188},"properties":{"imageUrl":"/uploads/2_el-1744075959491-c7vrv2.mp4","alt":"샘플 이미지","size":{"web":{"width":"23.24%","height":"374px"}}}},{"type":"image","id":"el-1744075959716-m45bz9","layout":{"column":3,"columnSpan":4,"top":3244.000030517578},"properties":{"imageUrl":"/uploads/2_el-1744075959716-m45bz9.mp4","alt":"샘플 이미지","size":{"web":{"width":"47.42%","height":"383px"}}}}]
    },
    {
      id: 'template-3',
      name: '가정 쇼핑몰',
      description: '가정적이고 푸근한 인상의 디자인',
      preview: `${import.meta.env.VITE_BACKEND_URL}/uploads/template3.png`,
      elements: 
      [{"type":"header","id":"el-1","layout":{"column":1,"columnSpan":8,"top":0},"properties":{"title":"코지홈","logoUrl":"/uploads/image.jpg","menuItems":[{"title":"신상품","url":"/new","highlight":true},{"title":"인기상품","url":"/best"},{"title":"전체상품","url":"/products"},{"title":"홈데코","url":"/decor"},{"title":"이벤트","url":"/event"}],"categories":[],"backgroundColor":"#e0e0e0","fontFamily":"Noto Sans KR","fontSize":"16px","fontWeight":"500","size":{"web":{"width":"99.21%","height":"50px"}},"borderBottom":"1px solid #FFE4C4"}},{"type":"grid2","id":"el-9","layout":{"column":1,"columnSpan":8,"top":1171.0000305175781},"properties":{"sortList":["전체","일간","주간","월간"],"title":"인기 상품","columns":3,"size":{"web":{"width":"46.28%","height":"305px"}}}},{"type":"image","id":"el-7","layout":{"column":1,"columnSpan":4,"top":336},"properties":{"imageUrl":"/uploads/image.jpg","alt":"샘플 이미지","size":{"web":{"width":"46.28%","height":"474px"}}}},{"type":"text","id":"el-6","layout":{"column":5,"columnSpan":3,"top":385},"properties":{"content":"탬플릿 텍스트 박스입니다. 당신만의 홈페이지 텍스트를 적어보세요.","fontSize":"32px","fontWeight":"bold","color":"#000000","textAlign":"left","size":{"web":{"width":"41.45%","height":"205px"}}}},{"type":"colorbox","id":"el-1744803922117-po0inc","layout":{"column":1,"columnSpan":12,"top":225.79999256134033},"properties":{"backgroundColor":"#878787","height":"150px","borderRadius":"12px","size":{"web":{"width":"148.51%","height":"725px"}}}},{"type":"text","id":"el-1744803949052-kr0fgb","layout":{"column":5,"columnSpan":3,"top":659.2000274658203},"properties":{"content":"상품 소개 문구 템플릿입니다.","fontSize":"24px","fontWeight":"normal","color":"#ffffff","textAlign":"left","size":{"web":{"width":"37.13%","height":"98px"}}}}]




    },
  ];

  return (
    <div className='mt-6'>
      <div className='grid grid-cols-1 sm:grid-cols-1 gap-4'>
        {templates.slice(0, 3).map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className='cursor-pointer border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition'
          >
            <img src={template.preview} alt={template.name} className='w-full h-40 object-cover' />
            <div className='p-3'>
              <h3 className='font-semibold text-lg'>{template.name}</h3>
              <p className='text-sm text-gray-600'>{template.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-center mt-6'>
        <button
          onClick={() => setShowModal(true)}
          className='px-5 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm'
        >
          더보기
        </button>
      </div>

      {showModal &&
        createPortal(
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[11000]'>
            <div className='bg-white max-w-4xl w-full rounded-lg p-6 overflow-y-auto max-h-[90vh] relative'>
              <button
                onClick={() => setShowModal(false)}
                className='absolute top-3 right-4 text-gray-400 text-xl hover:text-black'
              >
                ✕
              </button>
              <h2 className='text-xl font-bold mb-4'>템플릿 전체 보기</h2>

              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className='cursor-pointer border rounded-lg overflow-hidden shadow hover:shadow-md transition'
                    onClick={() => {
                      console.log('!!!!!!!!!!!!선택된 템플릿의 요소:', template.elements); 
                      onSelectTemplate(template);
                      setShowModal(false);
                    }}
                  >
                    <img src={template.preview} alt={template.name} className='w-full h-40 object-cover' />
                    <div className='p-3'>
                      <h3 className='font-semibold text-base'>{template.name}</h3>
                      <p className='text-sm text-gray-600 line-clamp-2'>{template.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-6 text-right'>
                <button
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 text-sm text-gray-600 hover:text-black'
                >
                  닫기
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
