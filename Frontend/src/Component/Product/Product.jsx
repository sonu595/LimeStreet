import React, { useEffect, useRef, useState } from 'react'
import Text from './Text'
import Card from './Card'
import axios from 'axios';

const Product = () => {
  const [data, setdata] = useState([])
  const scrollref = useRef(null)

  useEffect(() => {
      axios.get("http://localhost:8080/api/products")
    .then(res => {
      console.log(res.data);
      setdata(res.data);
    })
    .catch(err => console.log(err));
    }, []);

    const scrollLeft = () => {
      scrollref.current.scrollBy({ left: -300, behavior: "smooth" });
    };

    const scrollRight = () => {
      scrollref.current.scrollBy({ left: 300, behavior: "smooth" });
    };
    
  return (
    <div className="relative min-h-screen bg-black items-center justify-center">
      <Text scrollLeft={scrollLeft} scrollRight={scrollRight} />
      <div ref={scrollref} className='p-8 overflow-x-auto scrollbar-hide'>
        <div className='flex gap-6 w-max'>
          {data.map((item) => (
            <Card key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  )
}


export default Product
