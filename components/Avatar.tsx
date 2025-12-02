import React from 'react'
import { createAvatar } from '@dicebear/core'
import { rings } from '@dicebear/collection'
import Image from 'next/image'

const Avatar = ({seed,className}:{seed:string,className?:string}) => {
    const ca = createAvatar(rings,{
        seed
    })
    const svg = ca.toString()
    const base64Svg = Buffer.from(svg).toString("base64");
    const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;
  return <Image 
            src={dataUrl}
            height={100}
            width={100}
            className={className}
            alt='Image'/>
}

export default Avatar
