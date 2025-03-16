import useToggle from '../../hooks/useToggle';

import { useEffect, useState } from 'react';
import {
  getAllSellerInventories,
  getSearchSellerInventories,
  updateSellerInventories,
} from '../../services/inventory.service';
import SellerTitle from './components/common/SellerTitle';
import SellerToolBar from './components/layout/SellerToolBar';
import SellerContentHeader from './components/common/SellerContentHeader';
import SellerSearch from './components/common/SellerSearch';
import { SellerInventoryTable } from './components/pages/SellerInventoryTable';

const headers = [
  '카테고리ID',
  '상품ID',
  '상품명',
  '재고',
  '최소 재고',
  '최근 입고일',
  '상태',
  '작업',
];

const PAGE_SIZE = 15;
function SellerInventoryPage() {
  const { onToggle, isOpen, toggleId } = useToggle();
  const [inventoryIds, setInventoryIds] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [page, setPage] = useState(0);

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
    const data = await getAllSellerInventories(page, PAGE_SIZE);

    setInventories(data);
  }

  // 재고 검색
  async function onSearch(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const search = formData.get('search');
    const data = await getSearchSellerInventories(page, PAGE_SIZE, search);

    setInventories(data);
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
    getInventoriesFetch();
  }, []);

  return (
    <section>
      {/* 헤더 */}
      <SellerContentHeader>
        <SellerTitle type={'main'}>재고관리</SellerTitle>
        <p>재고 목록 및 관리</p>

        {/* 도구 */}
        <SellerToolBar>
          <SellerSearch placeholder={'상품명을 입력하세요.'} onSearch={onSearch} />
        </SellerToolBar>
      </SellerContentHeader>
      <SellerInventoryTable
        headers={headers}
        inventories={inventories}
        actionButtonName={'수정'}
        onCheck={onCheck}
        onToggle={onToggle}
        isToggle={isOpen}
        toggleId={toggleId}
        onUpdate={onUpdateInventories}
      />
    </section>
  );
}

export default SellerInventoryPage;
