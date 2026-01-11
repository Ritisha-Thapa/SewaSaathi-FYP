const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden">
      <img
        src={service.image}
        alt={service.name}
        className="h-48 w-full object-cover"
      />

      <div className="p-5 space-y-2">
        <span className="text-xs px-2 py-1 bg-blue-50 rounded">
          {service.category.name}
        </span>

        <h3 className="text-lg font-semibold">{service.name}</h3>
        <p className="text-sm text-gray-600">{service.description}</p>

        <div className="pt-3 border-t flex justify-between text-sm">
          <span>Service price</span>
          <span className="font-medium">
            Rs. {Number(service.base_price).toLocaleString()}
          </span>
        </div>

        <p className="text-xs text-gray-500">
          + 1% insurance charge applied later
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
