export default function EditorTemplateGrid({ onSelectTemplate }) {
    const templates = [
      {
        id: 'template-1',
        name: '모던 쇼핑몰',
        description: '깔끔한 헤더와 상품 정렬 템플릿',
        preview: `${import.meta.env.VITE_BACKEND_URL}/uploads/template1.png`,
        elements: [
          {
            type: "header",
            id: "el-1",
            layout: { column: 1, columnSpan: 8, top: 0 },
            properties: {
              title: "MONOCHROME",
              logoUrl: "/uploads/minimal_logo.png",
              menuItems: [
                { title: "NEW", url: "/new", highlight: true },
                { title: "COLLECTIONS", url: "/collections" },
                { title: "DESIGNERS", url: "/designers" },
                { title: "STYLE GUIDE", url: "/style" },
                { title: "CONTACT", url: "/contact" }
              ],
              categories: [],
              backgroundColor: "#ffffff",
              fontFamily: "Helvetica Neue",
              fontSize: "14px",
              fontWeight: "500",
              size: { web: { width: "95.39%", height: "80px" } },
              borderBottom: "1px solid #f0f0f0"
            }
          },
          {
            type: "banner",
            id: "el-2",
            layout: { column: 1, columnSpan: 8, top: 100 },
            properties: {
              title: "FALL COLLECTION 2024",
              subtitle: "Discover minimalist elegance",
              imageUrl: "/uploads/hero_bw.jpg",
              backgroundColor: "#000000",
              size: { web: { width: "97.80%", height: "500px" } },
              textColor: "#ffffff"
            }
          },
          {
            type: "grid",
            id: "el-3",
            layout: { column: 5, columnSpan: 4, top: 2740.8 },
            properties: {
              sortList: ["NEW ARRIVALS", "BESTSELLERS", "ON SALE"],
              title: "CURATED SELECTION",
              columns: 2,
              size: { web: { width: "44.2%", height: "auto" } },
              items: [
                { imageUrl: "/uploads/product1.jpg", title: "Wool Coat", price: "₩289,000" },
                { imageUrl: "/uploads/product2.jpg", title: "Leather Bag", price: "₩195,000" }
              ]
            }
          },
          {
            type: "text",
            id: "el-6",
            layout: { column: 5, columnSpan: 4, top: 2286.8 },
            properties: {
              content: "Timeless pieces for the modern wardrobe",
              fontSize: "24px",
              fontWeight: "300",
              color: "#6867c1",
              textAlign: "left",
              size: { web: { width: "46.7%", height: "auto" } },
              fontFamily: "Helvetica Neue"
            }
          },
          {
            type: "image",
            id: "el-7",
            layout: { column: 1, columnSpan: 3, top: 2721 },
            properties: {
              imageUrl: "/uploads/lookbook.jpg",
              alt: "Style Lookbook",
              size: { web: { width: "43.27%", height: "434px" } }
            }
          },
          {
            type: "image",
            id: "el-1743640009236",
            layout: { column: 1, columnSpan: 8, top: 1262 },
            properties: {
              imageUrl: "https://placehold.co/400x200",
              alt: "샘플 이미지",
              size: { web: { width: "99.81%", height: "86px" } }
            }
          },
          {
            type: "image",
            id: "el-1743640012820",
            layout: { column: 1, columnSpan: 4, top: 2060 },
            properties: {
              imageUrl: "https://placehold.co/400x200",
              alt: "샘플 이미지",
              size: { web: { width: "100%", height: "auto" } }
            }
          }
        ]
      },
      {
        id: 'template-2',
        name: '감성 쇼핑몰',
        description: '큰 이미지와 스크롤 배너 중심 구성',
        preview: '/templates/template2.png',
        elements: [{"type":"header","id":"el-1","layout":{"column":1,"columnSpan":8,"top":0},"properties":{"title":"Helinox","logoUrl":"/uploads/helinox.svg","menuItems":[{"title":"SHOP","url":"/shop/shopbrand.html?type=P&xcode=051","highlight":true},{"title":"STORY","url":"/board/board.html?code=helinox_image6"},{"title":"HCC","url":"/shop/page.html?id=2"}],"categories":[{"title":"THUNDERBOLT PROJECT","url":"/shop/shopbrand.html?type=Y&xcode=028"},{"title":"체어","url":"/shop/shopbrand.html?type=X&xcode=034"},{"title":"테이블","url":"/shop/shopbrand.html?type=X&xcode=035"},{"title":"코트","url":"/shop/shopbrand.html?type=X&xcode=036"},{"title":"텐트&쉐이드","url":"/shop/shopbrand.html?type=X&xcode=037"}],"backgroundColor":"#FFFFFF","fontFamily":"Noto Sans KR","fontSize":"15px","fontWeight":"bold","size":{"web":{"width":"100%","height":"70px"}},"borderBottom":"1px solid #EEEEEE"}}
        ,{"type":"banner","id":"el-2","layout":{"column":1,"columnSpan":8,"top":1265},"properties":{"title":"V-Tarp 4.0 Roof","subtitle":"합리적인 가격의 멋진 상품을 발견하세요",
        "imageUrl":"/uploads/helinox2.jpg","backgroundColor":"#000000","size":{"web":{"width":"100%","height":"auto"}},"textColor":"#FFFFFF","overlayColor":"rgba(0,0,0,0.5)"}},
        {"type":"grid","id":"el-3","layout":{"column":1,"columnSpan":8,"top":724},"properties":{"sortList":["전체","일간","주간","월간"],"title":"Pendleton X Helinox","columns":4,"size":{"web":{"width":"99.81%","height":"223px"}},"subtitle":"자연과 조화를 이루는 감각적인 디자인의 제품","items":[{"imageUrl":"/shopimages/helinox/0460010000012.jpg?1742282187","title":"Pendleton X Helinox Chair Two Home","price":"₩330,000"},{"imageUrl":"/shopimages/helinox/0460010000032.jpg?1742283450","title":"Pendleton X Helinox Table Side Storage S","price":"₩135,000"},{"imageUrl":"/shopimages/helinox/0460010000022.jpg?1742283093","title":"Pendleton X Helinox Chair Two Home","price":"Sold Out"},{"imageUrl":"/shopimages/helinox/0460010000042.jpg?1742283548","title":"Pendleton X Helinox Table Side Storage S","price":"₩135,000"}],"backgroundColor":"#FFFFFF","borderRadius":"0px"}},
        {"type":"text","id":"el-6","layout":{"column":1,"columnSpan":8,"top":1026.7999877929688},"properties":{"content":"Helinox Special Promotion","fontSize":"48px","fontWeight":"700","color":"#000000","textAlign":"center","size":{"web":{"width":"98.67%","height":"120px"}},"fontFamily":"Noto Sans KR"}},
        {"type":"banner","id":"el-2","layout":{"column":1,"columnSpan":8,"top":1265},"properties":{"title":"V-Tarp 4.0 Roof","subtitle":"합리적인 가격의 멋진 상품을 발견하세요","imageUrl":"/uploads/helinox3.jpg","backgroundColor":"#000000","size":{"web":{"width":"100%","height":"auto"}},"textColor":"#FFFFFF","overlayColor":"rgba(0,0,0,0.5)"}},
        {"type":"grid","id":"el-3","layout":{"column":1,"columnSpan":8,"top":724},"properties":{"sortList":["전체","일간","주간","월간"],"title":"Pendleton X Helinox","columns":4,"size":{"web":{"width":"99.81%","height":"223px"}},"subtitle":"자연과 조화를 이루는 감각적인 디자인의 제품","items":[{"imageUrl":"/shopimages/helinox/0460010000012.jpg?1742282187","title":"Pendleton X Helinox Chair Two Home","price":"₩330,000"},{"imageUrl":"/shopimages/helinox/0460010000032.jpg?1742283450","title":"Pendleton X Helinox Table Side Storage S","price":"₩135,000"},{"imageUrl":"/shopimages/helinox/0460010000022.jpg?1742283093","title":"Pendleton X Helinox Chair Two Home","price":"Sold Out"},{"imageUrl":"/shopimages/helinox/0460010000042.jpg?1742283548","title":"Pendleton X Helinox Table Side Storage S","price":"₩135,000"}],"backgroundColor":"#FFFFFF","borderRadius":"0px"}},{"type":"image","id":"el-1743661829114-7lksk9","layout":{"column":1,"columnSpan":8,"top":267.00001525878906},"properties":{"imageUrl":"/uploads/helinox2.jpg","alt":"샘플 이미지","size":{"web":{"width":"99.81%","height":"72px"}}}}]
         // 필요 시 구성
      }
    ];
  
    return (
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {templates.map((template) => (
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
    );
  }
  