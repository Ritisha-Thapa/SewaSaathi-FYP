import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../../utils/api';
import Skeleton from '../../../shared/components/layout/Skeleton';
import { useTranslation } from 'react-i18next';

const MyServices = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/services/provider-category-services/');
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch services', err);
      setError(
        t(
          'provider.my_services_load_error',
          'Unable to load services. Please try again later.'
        )
      );
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [t, i18n.language]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-full h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1B3C53]">
        {t('provider.my_services', 'My Services')}
      </h2>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                {t('provider.service_name', 'Service Name')}
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                {t('provider.category', 'Category')}
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                {t('provider.price', 'Price (Rs.)')}
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                {t('provider.pricing_type', 'Pricing Type')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-[#1B3C53]">
                  {t(`service_names.${service?.name_key}`, {
                    defaultValue: service?.name_key || '-',
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {t(`categories.${service?.category?.name_key}`, {
                    defaultValue: service?.category?.name_key || '-',
                  })}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {Number(service.base_price || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                  {service.pricing_type || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!error && services.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {t('provider.no_services_found', 'No services found for your category.')}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices;
