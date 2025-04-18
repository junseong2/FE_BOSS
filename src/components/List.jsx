// interface ListProps { }

import ListItem from './ListItem';

export default function List({ items }) {
  return (
    <ul>
      {items.map((item, index) => {
        return <ListItem key={index} />;
      })}
    </ul>
  );
}
