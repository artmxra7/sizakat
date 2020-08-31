import React from 'react';
import { action } from '@storybook/addon-actions';

import CardList from './CardList';

export default {
    component: CardList,
    title: 'Card/Card List',
    excludeStories: /.*Data$/,
}

export const cardListData = {
    list: [
        {id: 1, desc: 'Warga', label: 'Lorem Ipsum'},
        {id: 2, desc: 'Warga', label: 'Sit Dolor Amet'},
        {id: 3, desc: 'Institusi', label: 'Consectetur Adisipicing'},
        {id: 4, desc: 'Pekerja', label: 'Elit Sed Do'},
        {id: 5, desc: 'Institusi', label: 'Eiusmod Tempor'},
    ],
  path: '/somewhere'
}

export const Default = () => <CardList { ...cardListData } />
