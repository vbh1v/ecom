import React from 'react';
import Banner from '@/components/Banner'
import CollectionList from './CollectionList';

const Body: React.FC = () => {
  return <div className='flex flex-col justify-evenly'>
    <Banner/>
    <CollectionList/>
    </div>
};

export default Body;