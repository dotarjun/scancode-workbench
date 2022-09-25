import React from 'react';
import { DataNode } from 'rc-tree/lib/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeTreeNodeStyles } from './iconGenerators';

const SwitcherIcon = (obj: unknown) => {
  const node = obj as DataNode & { expanded: boolean };
  
  if (node.isLeaf) {
    // return <i></i>
    // return false;
    return (
      <FontAwesomeIcon
        icon={faFileLines}
        style={{
          ...FontAwesomeTreeNodeStyles,
          color: '#000',
        }}
      />
    )
  }

  if(node.expanded){
    return (
      <FontAwesomeIcon
        icon={faFolderOpen}
        style={{
          ...FontAwesomeTreeNodeStyles,
          color: 'rgba(50,152,219,255)',
        }}
      />
    );
    // return getTreeNodeIconCustomComponent(DownArrow);
    // return getTreeNodeIconFromSvgPath(
    //   arrowPath,
    //   { cursor: 'pointer', backgroundColor: 'white' },
    //   { transform: `rotate(90deg)` },
    // );
  }

  return (
    <FontAwesomeIcon
      icon={faFolder}
      style={{
        ...FontAwesomeTreeNodeStyles,
        color: 'rgba(50,152,219,255)',
      }}
    />
  );
  // return getTreeNodeIconCustomComponent(RightArrow);
  // return getTreeNodeIconFromSvgPath(
  //   arrowPath,
  //   { cursor: 'pointer', backgroundColor: 'white' },
  // )
};

export default SwitcherIcon;