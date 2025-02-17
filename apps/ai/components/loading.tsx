
import React from 'react'
import Image from 'next/image'

export const Loading: React.FC = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Image src="/assets/icon.png" width="64" height="64" alt="Deni AI"/>
        </div>
    )
}
