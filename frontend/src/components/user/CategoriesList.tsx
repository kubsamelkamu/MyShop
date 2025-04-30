import Image from "next/image";

const categories = [
  { name: "Electronics", image: "/electronics.jpg" },
  { name: "Fashion", image: "/fashion.jpg" },
  { name: "Health & Beuty", image: "/beauty.jpg" },
  { name: "Books", image: "/books.jpg" },
];

const CategoryList = () => {
  return (
    <div className="my-8 bg-gray">
      <h2 className="text-2xl text-center text-blue-500 font-bold mb-4">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <a
            key={index}
            className="relative group block rounded-lg overflow-hidden shadow-lg" >
            <div className="w-full h-48 md:h-64 relative">
              <Image
                src={category.image}
                alt={`Image of ${category.name}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={index === 0} 
              />
              <div className="absolute inset-0  bg-opacity-30 flex items-start justify-start p-3">
                <span className="text-white text-lg font-bold group-hover:opacity-100 transition-opacity duration-300">
                  {category.name}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
