import useToggle from '../../hooks/useToggle';

import { useEffect, useState } from 'react';
import { getAllSellerInventories, updateSellerInventories } from '../../services/inventory.service';
import SellerTitle from './components/common/SellerTitle';
import SellerSearch from './components/common/SellerSearch';
import { SellerInventoryTable } from './components/pages/SellerInventoryTable';
import SellerContentHeader from './components/common/SellerContentHeader';
import SellerTabs from './components/common/SellerTabs';
import TableSkeleton from '../../components/skeleton/TableSkeleton';
import Pagination from '../../components/Pagination';

const sortList = [
  // 탭 목 데이터
  { key: 'all', label: '전체 목록' },
  { key: 'warn', label: '재고 부족' },
  { key: 'soldout', label: '품절' },
];


const PAGE_SIZE = 8;
function SellerInventoryPage() {
  const { onToggle, isOpen, toggleId } = useToggle();
  const [inventoryIds, setInventoryIds] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [productName, setProductName] = useState('');
  const [page, setPage] = useState(0);

  const [selectedTab, setSelectedTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(1);

  // 재고 선택
  async function onCheck(e) {
    const isChecked = e.currentTarget.checked;
    const id = e.currentTarget.value;

    if (isChecked) {
      setInventoryIds((prev) => [...prev, id]);
    } else {
      const updatedIds = inventoryIds.filter((prevId) => {
        return prevId != id;
      });
      setInventoryIds(updatedIds);
    }
  }

  // 재고 조회
  async function getInventoriesFetch() {
    setLoading(true);
    const { inventories, totalCount } = await getAllSellerInventories(
      page,
      PAGE_SIZE,
      productName,
      selectedTab,
    );
    setInventories(inventories);
    setTotalCount(totalCount || 1);
    setLoading(false);
  }

  // 재고 수정
  async function onUpdateInventories(inventory) {
    const updatedInventories = inventories.map((oldInventory) => {
      if (oldInventory.productId === inventory.productId) {
        return inventory;
      }
      return oldInventory;
    });
    setInventories(updatedInventories);

    const sendInventory = {
      name: inventory.name,
      category: inventory.category,
      inventoryId: inventory.inventoryId,
      productId: inventory.productId,
      minStock: inventory.minStock,
      stock: inventory.stock,
    };
    const data = await updateSellerInventories([sendInventory]);
    if (!data) return;
    if (data.status === 'OK') {
      alert(data.data.productName + '의 정보가 수정되었습니다.');
    }
  }

  useEffect(() => {
    getInventoriesFetch(productName);
  }, [page, productName, selectedTab]);

  return (
    <section className='bg-[#f3f4f6] min-h-screen h-auto p-3 border border-gray-200 rounded-[5px] w-full'>
      {/* 헤더 */}
      <SellerContentHeader>
        <SellerTitle type={'main'}>재고관리</SellerTitle>
      </SellerContentHeader>

      {/* 탭(메뉴) */}
      <SellerTabs
        tabList={sortList}
        selectedTab={selectedTab}
        onTabChange={(e) => setSelectedTab(e.currentTarget.dataset.tabId)}
      />

      {/*  컨텐츠 */}
      <div className='bg-white mt-5 border border-gray-200 p-3 py-0'>
        {/* 검색창 */}
        <div className='py-3'>
          <SellerSearch
            placeholder={'상품명을 입력하세요.'}
            onSearch={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const search = formData.get('search').toString() || '';
              setProductName(search);
            }}
          />
        </div>

        {/* 테이블 */}
        {loading ? (
          <TableSkeleton />
        ) : (
          <SellerInventoryTable
            inventories={inventories}
            actionButtonName={'수정'}
            onCheck={onCheck}
            onToggle={onToggle}
            isToggle={isOpen}
            toggleId={toggleId}
            onUpdate={onUpdateInventories}
          />
        )}
      </div>
      <Pagination
        totalPageCount={Math.max(totalCount / PAGE_SIZE)}
        handlePageClick={({ selected }) => {
          setPage(selected);
        }}
      />
    </section>
  );
}

export default SellerInventoryPage;
