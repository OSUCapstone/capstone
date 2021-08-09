const ListItem = ({ title, onClick }) => (
  <p
    className="font-medium text-gray-500 hover:text-gray-800 cursor-pointer"
    onClick={onClick}
  >
    {title}
  </p>
);

export default ListItem;
