import React from 'react';
import { useTranslation } from 'react-i18next';

const ServiceHero = ({ item }) => {
    const { t, i18n } = useTranslation();
    const formatPrice = (n) => {
        const locale = i18n.language === "ne" ? "ne-NP" : "en-IN";
        return `${t("common.currency_prefix", "Rs.")} ${new Intl.NumberFormat(locale).format(Number(n || 0))}`;
    };

    return (
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <img
                    src={item.image}
                    alt={t(`service_names.${item.name_key}`)}
                    className="w-full h-96 object-cover"
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-primary mb-4">{t('services.service_description', 'About this Service')}</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                    {t(`service_names.${item?.description_key}`, {
                        defaultValue: t(`service_names.${item?.name_key}`, {
                            defaultValue: item?.description_key || item?.name_key || t('services.service_description', 'About this Service')
                        })
                    })}
                </p>

                <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 text-lg">{t('booking_form.base_price')}:</span>
                        <span className="text-2xl font-bold text-[#1B3C53]">
                            {formatPrice(item.base_price)}
                        </span>
                    </div>
                    <p className="text-orange-600 mt-2 text-sm bg-orange-50 inline-block px-3 py-1 rounded-full border border-orange-400">
                        {t('booking_form.insurance_note')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ServiceHero;
