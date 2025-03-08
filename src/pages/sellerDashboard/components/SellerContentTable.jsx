import styles from '../styles/SellerContentTable.module.css';
import common from '../styles/common.module.css';

function SellerContentTable({ headers, data, actionButtonName, onToggle }) {
  return (
    <div className={styles.sellerContentTableLayout}>
      <table className={styles.sellerContentTable}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
              <td>
                <button className={common.commonButtonNormal} onClick={onToggle}>
                  {actionButtonName}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SellerContentTable;
