---
aside: false
---

@componentIntro(/src/components/blocks/hero/property-search-hero.tsx)

@taxonomyTable(/src/components/blocks/hero/property-search-hero.tsx)

## Demo

```tsx demo
import { useState } from 'react';
import { PropertySearchHero } from '@/components/blocks/hero/property-search-hero';

export function Demo() {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  return (
    <PropertySearchHero
      title={
        <>
          <i>Find</i> Properties <i>that match</i> Your Future
        </>
      }
      text="Smart real estate decisions start with clear data, rusted listings, and expert guidance in one platform"
      backgroundImage="https://images.unsplash.com/photo-1587913560680-7f8187bf9634?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXJjaGl0ZWN0dXJlJTIwaG91c2V8ZW58MHwwfDB8fHww"
      form={{
        fields: [
          {
            id: 'location',
            label: 'Location',
            placeholder: 'Enter city or zip code',
            value: location,
            onChange: setLocation,
            type: 'text',
          },
          {
            id: 'property-type',
            label: 'Property Type',
            placeholder: 'Select type',
            value: propertyType,
            onChange: setPropertyType,
            type: 'select',
            options: [
              { value: 'house', label: 'House' },
              { value: 'apartment', label: 'Apartment' },
              { value: 'condo', label: 'Condo' },
              { value: 'townhouse', label: 'Townhouse' },
            ],
          },
          {
            id: 'price-range',
            label: 'Price Range',
            placeholder: 'Select range',
            value: priceRange,
            onChange: setPriceRange,
            type: 'select',
            options: [
              { value: '0-200k', label: '$0 - $200k' },
              { value: '200k-500k', label: '$200k - $500k' },
              { value: '500k-1m', label: '$500k - $1M' },
              { value: '1m+', label: '$1M+' },
            ],
          },
        ],
        buttonText: 'Search',
        onSearch: () => {
          console.log('Searching for:', { location, propertyType, priceRange });
        },
      }}
    />
  )
}
```

@componentApiReference(/src/components/blocks/hero/property-search-hero.tsx)