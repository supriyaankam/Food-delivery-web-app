const MenuCategories = ({ categories }) => {
  return (
    <div className="categories-container">
      {categories.map((cat) => (
        <div key={cat._id} className="category-card">
          <img src={cat.image} alt={cat.name} />
          <p>{cat.name}</p>
        </div>
      ))}
    </div>
  );
};

export default MenuCategories;