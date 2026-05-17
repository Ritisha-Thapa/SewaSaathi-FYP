import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import Skeleton from '../../../shared/components/layout/Skeleton';
import { useTranslation } from 'react-i18next';

const MyServices = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [i18n.language]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const [profile, categories, allServices] = await Promise.all([
        api.get('/accounts/profile/'),
        api.get('/services/service-categories/'),
        api.get('/services/service/')
      ]);

      const rawSkills = Array.isArray(profile?.skills)
        ? profile.skills
        : String(profile?.skills || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

      const normalizedSkills = rawSkills.map((s) => String(s || '').trim().toLowerCase()).filter(Boolean);
      const skillToCategoryHints = {
        cleaner: ['category_cleaning', 'cleaning', 'clean'],
        painter: ['category_painting', 'painting', 'paint'],
        electrician: ['category_electrical_repairing', 'electrical_repairing', 'electrical', 'electric'],
        gardener: ['category_gardening', 'gardening', 'garden'],
        carpenter: ['category_carpentry', 'carpentry', 'carpenter'],
        plumber: ['category_plumbing', 'plumbing', 'plumb'],
      };

      const matchedCategoryIds = new Set();

      normalizedSkills.forEach((skill) => {
        const hints = skillToCategoryHints[skill] || [skill];
        categories.forEach((c) => {
          const nameKey = String(c.name_key || '').toLowerCase();
          const slug = String(c.slug || '').toLowerCase();
          const matched = hints.some((hint) => hint && (nameKey === hint || slug === hint || nameKey.includes(hint) || slug.includes(hint)));
          if (matched) {
            matchedCategoryIds.add(c.id);
          }
        });
      });

      if (matchedCategoryIds.size === 0) {
        // Final fallback: keep old behavior if provider skill/category cannot be resolved.
        const providerServices = await api.get('/services/provider-services/?my_services=true');
        const normalizedRows = providerServices.map((row) => ({
          id: row?.service?.id || row.id,
          name_key: row?.service?.name_key,
          category: row?.service?.category,
          base_price: row?.price,
          pricing_type: row?.pricing_type,
        }));
        setServices(normalizedRows);
        return;
      }

      const servicesData = (allServices || []).filter((service) =>
        matchedCategoryIds.has(service?.category?.id)
      );
      setServices(servicesData);
    } catch (err) {
      console.error("Failed to fetch services", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Service Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price (Rs.)</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Pricing Type</th>
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

        {services.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No services found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices;
