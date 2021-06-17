
import { isObject, isArray } from 'lodash';
import React, { useEffect, useState } from 'react';
import { array, string } from 'prop-types';
import { Breadcrumb } from 'antd';

const cleanPathname = dirtyPathname => {
  const url = new URL(dirtyPathname, location.origin);
  return url.pathname;
};

const PathCrumb = props => {
  const { menus, path } = props;
  const [crumbs, setCrumbs] = useState(null);
  const [menuPathMap, setMenuPathMap] = useState();
  const [menuIdMap, setMenuIdMap] = useState();

  useEffect(() => {

    if (isArray(menus) && menus.length) {
      const pathMap = {};
      const idMap = {};
      menus.forEach(menu => {
        pathMap[cleanPathname(menu.path)] = menu;
        idMap[menu.id] = menu;
      });
      setMenuPathMap(pathMap);
      setMenuIdMap(idMap);
    }

  }, [menus]);

  useEffect(() => {
    if (isObject(menuPathMap) && isObject(menuIdMap)) {
      const inner = pathName => {
        if(pathName.length){
          let menu = menuPathMap[pathName];
          if (isObject(menu)) {
            if (menuPathMap) {
              const titles = [];
              const inner = menu => {
                titles.push(menu.title);
                if (menu.parentId) {
                  inner(menuIdMap[menu.parentId]);
                }
              };
              inner(menu);
              setCrumbs(titles.reverse());
            } else {
              setCrumbs([menu.title]);
            }
          } else {
            setCrumbs(null);
            inner(pathName.replace(/\/[^/]*$/, ''));
          }
        }
      };

      inner(path);
    }
  }, [path, menuPathMap, menuIdMap]);

  if(isArray(crumbs) && crumbs.length){
    return (
      <Breadcrumb style={ { display: 'inline-block' } }>
        {crumbs.map((item, idx) => (
          <Breadcrumb.Item key={ idx }>{ item }</Breadcrumb.Item>
        )) }
      </Breadcrumb>
    );
  }

  return null;
};

PathCrumb.propTypes = {
  menus: array,
  path: string,
};

export default PathCrumb;
