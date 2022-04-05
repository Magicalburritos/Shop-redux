import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';

import {
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} from '../../utils/actions';
import { QUERY_CATEGORIES } from '../../utils/queries';

import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  //we only need the categories here, so we destructure it out of our global state
  const { categories } = state;

  // useQuery is asynchronous, so it wont be done getting data on page load so we need
  // useEffect to check when useQuery is done and then dispatch data to global state
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories,
      });
      categoryData.categories.forEach((category) => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then((categories) => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories,
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = (id) => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id,
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
