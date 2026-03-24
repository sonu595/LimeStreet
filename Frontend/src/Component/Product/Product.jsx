import React, { useEffect, useRef, useState } from 'react'
import Text from './Text'
import Card from './Card'
import axios from 'axios';

const Product = () => {
  const [data, setdata] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollref = useRef(null)

  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then(res => {
        console.log(res.data);
        setdata(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const scrollLeft = () => {
    scrollref.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollref.current.scrollBy({ left: 320, behavior: "smooth" });
  };
  
  return (
    <div className="relative min-h-screen bg-black py-8 md:py-12">
      <Text scrollLeft={scrollLeft} scrollRight={scrollRight} />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      ) : (
        <div ref={scrollref} className='px-4 md:px-8 overflow-x-auto scrollbar-hide'>
          <div className='flex gap-6 w-max'>
            {data.map((item) => (
              <Card key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Product