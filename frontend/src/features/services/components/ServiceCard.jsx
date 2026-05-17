import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ServiceCard = ({ service }) => {
  const { t, i18n } = useTranslation();
  const formatCurrency = (amount) => {
    const locale = i18n.language === "ne" ? "ne-NP" : "en-IN";
    return `${t("common.currency_prefix", "Rs.")} ${new Intl.NumberFormat(locale).format(Number(amount || 0))}`;
  };

  return (
    <Link
      to={`/services/${service.category.slug}/${service.id}`}
      className="bg-background rounded-3xl shadow-md shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden block border border-white/20 group"
    >
      {service.image && (
        <div className="relative h-52 overflow-hidden">
          <img
            src={service.image}
            alt={t(`service_names.${service.name_key}`)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      <div className="p-6 space-y-4">
        <span className="inline-block px-4 py-1 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary rounded-full">
          {t(`categories.${service.category.name_key}`)}
        </span>

        <h3 className="text-xl font-black text-primary leading-tight">
          {t(`service_names.${service.name_key}`)}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {t(`service_names.${service.description_key}`)}
        </p>

        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {t("services.service_price", "Service Price")}
            </span>
            <span className="text-lg font-black text-gray-900">
              {formatCurrency(service.base_price)}
            </span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-tight">
              {t("services.insurance_checkout_note", "Insurance (1%) included at checkout")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
