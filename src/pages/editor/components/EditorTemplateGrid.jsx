import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function EditorTemplateGrid({ onSelectTemplate }) {
  const [showModal, setShowModal] = useState(false);

  const templates = [
    {
      id: 'template-1',
      name: '모던 쇼핑몰',
      description: '깔끔한 헤더와 상품 정렬 템플릿',
      preview: `https://bossassets.s3.amazonaws.com/template1.PNG`,
      elements: [{"type":"header","id":"el-1","layout":{"column":1,"columnSpan":8,"top":0},"properties":{"title":"Helinox","logoUrl":"/uploads/helinox.svg","menuItems":[{"title":"SHOP","url":"/shop/shopbrand.html?type=P&xcode=051","highlight":true},{"title":"STORY","url":"/board/board.html?code=helinox_image6"},{"title":"HCC","url":"/shop/page.html?id=2"}],"categories":[{"title":"THUNDERBOLT PROJECT","url":"/shop/shopbrand.html?type=Y&xcode=028"},{"title":"체어","url":"/shop/shopbrand.html?type=X&xcode=034"},{"title":"테이블","url":"/shop/shopbrand.html?type=X&xcode=035"},{"title":"코트","url":"/shop/shopbrand.html?type=X&xcode=036"},{"title":"텐트&쉐이드","url":"/shop/shopbrand.html?type=X&xcode=037"}],"backgroundColor":"#FFFFFF","fontFamily":"Noto Sans KR","fontSize":"15px","fontWeight":"bold","size":{"web":{"width":"100%","height":"70px"}},"borderBottom":"1px solid #EEEEEE"}},{"type":"banner","id":"el-2","layout":{"column":1,"columnSpan":8,"top":1265},"properties":{"title":"V-Tarp 4.0 Roof","subtitle":"합리적인 가격의 멋진 상품을 발견하세요","imageUrl":"/uploads/helinox2.jpg","backgroundColor":"#000000","size":{"web":{"width":"100%","height":"auto"}},"textColor":"#FFFFFF","overlayColor":"rgba(0,0,0,0.5)"}},{"type":"text","id":"el-6","layout":{"column":1,"columnSpan":8,"top":1026.7999877929688},"properties":{"content":"Helinox Special Promotion","fontSize":"48px","fontWeight":"700","color":"#000000","textAlign":"center","size":{"web":{"width":"98.67%","height":"120px"}},"fontFamily":"Noto Sans KR"}},{"type":"banner","id":"el-12","layout":{"column":1,"columnSpan":8,"top":1265},"properties":{"title":"V-Tarp 4.0 Roof","subtitle":"합리적인 가격의 멋진 상품을 발견하세요","imageUrl":"/uploads/helinox3.jpg","backgroundColor":"#000000","size":{"web":{"width":"100%","height":"auto"}},"textColor":"#FFFFFF","overlayColor":"rgba(0,0,0,0.5)"}},{"type":"grid","id":"el-3","layout":{"column":1,"columnSpan":8,"top":724},"properties":{"sortList":["전체","일간","주간","월간"],"title":"Pendleton X Helinox","columns":4,"size":{"web":{"width":"99.81%","height":"223px"}},"subtitle":"자연과 조화를 이루는 감각적인 디자인의 제품","items":[{"imageUrl":"/shopimages/helinox/0460010000012.jpg?1742282187","title":"Pendleton X Helinox Chair Two Home","price":"₩330,000"},{"imageUrl":"/shopimages/helinox/0460010000032.jpg?1742283450","title":"Pendleton X Helinox Table Side Storage S","price":"₩135,000"},{"imageUrl":"/shopimages/helinox/0460010000022.jpg?1742283093","title":"Pendleton X Helinox Chair Two Home","price":"Sold Out"},{"imageUrl":"/shopimages/helinox/0460010000042.jpg?1742283548","title":"Pendleton X Helinox Table Side Storage S","price":"₩135,000"}],"backgroundColor":"#FFFFFF","borderRadius":"0px"}},{"type":"image","id":"el-1743661829114-7lksk9","layout":{"column":1,"columnSpan":8,"top":267.00001525878906},"properties":{"imageUrl":"/uploads/helinox2.jpg","alt":"샘플 이미지","size":{"web":{"width":"99.81%","height":"72px"}}}}]
    },
    {
      id: 'template-2',
      name: '감성 쇼핑몰',
      description: '세련되고 깔끔한 헤더와 배너',
      preview: `https://bossassets.s3.amazonaws.com/template2.PNG`,
      elements: [{"type":"header","id":"el-1","layout":{"column":1,"columnSpan":8,"top":25},"properties":{"title":"Helinox","logoUrl":"/uploads/helinox.svg","menuItems":[{"title":"SHOP","url":"/shop/shopbrand.html?type=P&xcode=051","highlight":true},{"title":"STORY","url":"/board/board.html?code=helinox_image6"},{"title":"PRODUCTS","url":"/PRODUCTS"}],"categories":[{"title":"THUNDERBOLT PROJECT","url":"/shop/shopbrand.html?type=Y&xcode=028"},{"title":"체어","url":"/shop/shopbrand.html?type=X&xcode=034"},{"title":"테이블","url":"/shop/shopbrand.html?type=X&xcode=035"},{"title":"코트","url":"/shop/shopbrand.html?type=X&xcode=036"},{"title":"텐트&쉐이드","url":"/shop/shopbrand.html?type=X&xcode=037"}],"backgroundColor":"#FFFFFF","fontFamily":"Noto Sans KR","fontSize":"15px","fontWeight":"bold","size":{"web":{"width":"99.81%","height":"106px"}},"borderBottom":"1px solid #EEEEEE"}},{"type":"banner","id":"el-2","layout":{"column":1,"columnSpan":8,"top":258},"properties":{"title":"V-Tarp 4.0 Roof","subtitle":"합리적인 가격의 멋진 상품을 발견하세요","imageUrl":"/uploads/helinox3.jpg","backgroundColor":"#000000","size":{"web":{"width":"97.75%","height":"540px"}},"textColor":"#FFFFFF","overlayColor":"rgba(0,0,0,0.5)"}},{"type":"banner","id":"el-12","layout":{"column":1,"columnSpan":8,"top":258},"properties":{"title":"V-Tarp 4.0 Roof","subtitle":"합리적인 가격의 멋진 상품을 발견하세요","imageUrl":"/uploads/helinox3.jpg","backgroundColor":"#000000","size":{"web":{"width":"97.75%","height":"540px"}},"textColor":"#FFFFFF","overlayColor":"rgba(0,0,0,0.5)"}},{"type":"grid","id":"el-3","layout":{"column":1,"columnSpan":8,"top":1200.2222747802734},"properties":{"sortList":["전체","일간","주간","월간"],"title":"Pendleton X Helinox","columns":4,"size":{"web":{"width":"94.49%","height":"223px"}},"subtitle":"자연과 조화를 이루는 감각적인 디자인의 제품","items":[{"imageUrl":"/shopimages/helinox/0460010000012.jpg?1742282187","title":"Pendleton X Helinox Chair Two Home","price":"₩330,000"},{"imageUrl":"/shopimages/helinox/0460010000032.jpg?1742283450","title":"Pendleton X Helinox Table Side Storage S","price":"₩135,000"},{"imageUrl":"/shopimages/helinox/0460010000022.jpg?1742283093","title":"Pendleton X Helinox Chair Two Home","price":"Sold Out"},{"imageUrl":"/shopimages/helinox/0460010000042.jpg?1742283548","title":"Pendleton X Helinox Table Side Storage S","price":"₩135,000"}],"backgroundColor":"#FFFFFF","borderRadius":"0px"}},{"type":"image","id":"el-7","layout":{"column":1,"columnSpan":8,"top":2624.6666870117188},"properties":{"imageUrl":"/uploads/helinox2.jpg","alt":"샘플 이미지","size":{"web":{"width":"96.89%","height":"909px"}}}},{"type":"image","id":"el-7","layout":{"column":1,"columnSpan":8,"top":2624.6666870117188},"properties":{"imageUrl":"/uploads/helinox2.jpg","alt":"샘플 이미지","size":{"web":{"width":"96.89%","height":"909px"}},"borderRadius":"16px"}},{"type":"image","id":"el-7","layout":{"column":1,"columnSpan":8,"top":2624.6666870117188},"properties":{"imageUrl":"/uploads/helinox2.jpg","alt":"샘플 이미지","size":{"web":{"width":"96.89%","height":"909px"}}}},{"type":"image","id":"el-1744075920604-wvdfqc","layout":{"column":1,"columnSpan":2,"top":3218.6666870117188},"properties":{"imageUrl":"/uploads/2_el-1744075920604-wvdfqc.mp4","alt":"샘플 이미지","size":{"web":{"width":"24.61%","height":"418px"}}}},{"type":"image","id":"el-1744075959491-c7vrv2","layout":{"column":7,"columnSpan":2,"top":3237.6666870117188},"properties":{"imageUrl":"/uploads/2_el-1744075959491-c7vrv2.mp4","alt":"샘플 이미지","size":{"web":{"width":"23.24%","height":"374px"}}}},{"type":"image","id":"el-1744075959716-m45bz9","layout":{"column":3,"columnSpan":4,"top":3244.000030517578},"properties":{"imageUrl":"/uploads/2_el-1744075959716-m45bz9.mp4","alt":"샘플 이미지","size":{"web":{"width":"47.42%","height":"383px"}}}}]
    },

    {
      id: 'template-3',
      name: '가정 쇼핑몰',
      description: '가정적이고 푸근한 인상의 디자인',

      preview: `${import.meta.env.VITE_BACKEND_URL}/uploads/template3.png`,
   elements: 
   [
    {
      "type": "header",
      "id": "el-1",
      "layout": { "column": 1, "columnSpan": 8, "top": 37 },
      "properties": {
        "title": "코지홈",
        "logoUrl": "/uploads/image.jpg",
        "menuItems": [
          { "title": "신상품", "url": "/new", "highlight": true },
          { "title": "인기상품", "url": "/best" },
          { "title": "전체상품", "url": "/products" },
          { "title": "홈데코", "url": "/decor" },
          { "title": "이벤트", "url": "/event" }
        ],
        "categories": [],
        "backgroundColor": "#FFF5E6",
        "fontFamily": "Noto Sans KR",
        "fontSize": "16px",
        "fontWeight": "500",
        "size": { "web": { "width": "100%", "height": "80px" } },
        "borderBottom": "1px solid #FFE4C4"
      }
    },

    {
      "type": "grid",
      "id": "el-3",
      "layout": { "column": 1, "columnSpan": 8, "top": 1885.444 },
      "properties": {
        "sortList": ["신상품순", "인기순", "할인상품"],
        "title": "이번주 베스트셀러",
        "columns": 3,
        "items": [
          { "imageUrl": "/uploads/product1.jpg", "title": "플란넬 체크 담요", "price": "₩39,000" },
          { "imageUrl": "/uploads/product2.jpg", "title": "세라믹 머그컵", "price": "₩24,000" },
          { "imageUrl": "/uploads/product3.jpg", "title": "목재 트레이", "price": "₩32,000" }
        ],
        "backgroundColor": "#FFF9F0",
        "borderRadius": "12px",
        "size": { "web": { "width": "97.58%", "height": "223px" } }
      }
    },
    {
      "type": "colorbox",
      "id": "el-8",
      "layout": { "column": 1, "columnSpan": 8, "top": 1103.556 },
      "properties": {
        "backgroundColor": "#f8ecbf",
        "height": "150px",
        "borderRadius": "12px",
        "size": { "web": { "width": "100%", "height": "585px" } }
      }

    },

    {
      "type": "image",
      "id": "el-71",
      "layout": { "column": 5, "columnSpan": 3, "top": 500 },
      "properties": {
        "imageUrl": "/uploads/image.jpg",
        "alt": "샘플 이미지",
        "borderRadius": "8px",
        "boxShadow": "0 4px 12px rgba(0,0,0,0.1)",
        "size": { "web": { "width": "43.47%", "height": "430px" } }
      }
    },   {
      "type": "image",
      "id": "el-72",
      "layout": { "column": 5, "columnSpan": 3, "top": 1200 },
      "properties": {
        "imageUrl": "/uploads/image.jpg",
        "alt": "샘플 이미지",
        "borderRadius": "8px",
        "boxShadow": "0 4px 12px rgba(0,0,0,0.1)",
        "size": { "web": { "width": "43.47%", "height": "430px" } }
      }
    },
    {
      "type": "text",
      "id": "el-6",
      "layout": { "column": 1, "columnSpan": 3, "top": 1284 },
      "properties": {
        "content": "템플릿 텍스트.",
        "fontSize": "32px",
        "fontWeight": "normal",
        "color": "#000000",
        "textAlign": "left",
        "fontFamily": "Noto Sans KR",
        "animate": true,
        "size": { "web": { "width": "42.27%", "height": "276px" } }
      }
    },
    {
      "type": "text",
      "id": "el-1744079537691-qxh8t5",
      "layout": { "column": 1, "columnSpan": 3, "top": 1102.444 },
      "properties": {
        "content": "템플릿 텍스트",
        "fontSize": "48px",
        "fontWeight": "bold",
        "color": "#a1543a",
        "textAlign": "center",
        "animate": true,
        "size": { "web": { "width": "41.67%", "height": "94px" } }
      }
    }
  ]
  
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
