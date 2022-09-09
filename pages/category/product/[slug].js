import React, { useState } from 'react';
import {AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar} from 'react-icons/ai';

import _ from 'lodash';

import { Product } from '../../../components';

import { client, urlFor} from '../../../lib/client';

import { StateContext, useStateContext } from '../../../context/StateContext';
import NumberFormat from 'react-number-format';


const ProductDetails = ({ product, products }) => {
    const { image, name, details, price } = product;
    const img = _.first(image)?.url

    const [index, setIndex] = useState(0);

    const { incQty, decQty, qty, onAdd } = useStateContext ();
  return (
    <div>
        <div className='product-detail-container'>
            <div>
                <div className='image-container'>
                    <img src={img} className='product-detail-image' />
                    {/* <img src={urlFor(image && image[index])} className='product-detail-image' /> */}
                </div>
                <div className='small-images-container'>
                    {image?.map((item, i) => (
                        <img 
                            src={img}
                            // src={urlFor(item)}
                            className={i === index ? 'small-image selected-image' : 'small-image'}
                            onMouseEnter={() => setIndex(i)}
                            alt=""
                        />
                    ))}
                </div>
            </div>

            <div className='product-detail-desc'>
                <h1>{name}</h1>
                <div className='reviews'>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiOutlineStar/>

                </div>
                <p>
                    (20)
                </p>
                <h4>{details}</h4>
                {/* <p className='price'>${price}</p> */}
                <NumberFormat className="price" value={price} displayType={'text'} thousandSeparator={true} prefix={'₦'} />
                <div className='quantity'>
                    <p className='quantity-desc'>
                        <span className='minus' onClick={decQty}><AiOutlineMinus/></span>
                        <span className='num' onClick="">{qty}</span>
                        <span className='plus' onClick={incQty}><AiOutlinePlus/></span>
                    </p>
                </div>
                <div className='buttons'>
                    <button type='button' className='add-to-cart' onClick={ () => onAdd(product, qty)}>Add to Cart</button>
                    <button type='button' className='buy-now' onClick="">Buy Now</button>
                </div>
            </div>
        </div>

        <div className='maylike-product-wrapper'>
            <h2>You may also like</h2>
            <div className='marquee'>
                <div className='maylike-products-container track'>
                    {products.map((item) => (
                        <Product key={item._id}
                        product={item} />
                    ))}
                </div>
            </div>
        </div>
        
        
        
        <div className='maylike-product-wrapper'>
            <h2>You may also like</h2>
            <div className='marquee'>
                <div className='maylike-products-container track'>
                    {products.map((item) => (
                        <Product key={item._id}
                        product={item} />
                    ))}
                </div>
            </div>
        </div>

        
    </div>
  )
}

export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
        slug {
            current
        }
    }
    `;

    const products = await client.fetch(query)

    const paths = products.map((product) => ({
        params:{
            slug: product.slug.current
        }
    }));

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({ params: { slug }}) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product"]'
    
    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery);
  
    return {
      props: { products, product }
    }
  }

export default ProductDetails