import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'

interface Props {
  post: Post
}

const Post = ({ post }: Props) => {
  console.log(post)
  return (
    <main>
      <Header />
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()}
      />
      <article className="mx-w-3xl mx-auto p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="spce-x-2 flex items-center">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()}
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => {
                return <h1 className="my-5 text-2xl font-bold" {...props} />
              },
              h2: (props: any) => {
                return <h2 className="my-5 text-xl font-bold" {...props} />
              },
              li: ({ children }: any) => {
                return <li className="ml-4 list-disc">{children}</li>
              },
              link: ({ href, children }: any) => {
                return (
                  <a href={href} className="text-blue-500 hover:underline">
                    {children}
                  </a>
                )
              },
            }}
          />
        </div>
      </article>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug{
            current
        }
    }`
  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => ({
    params: { slug: post.slug.current },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author->{
            name, 
            image
        },
        'comments': *[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true],
            description,
            mainImage,
            slug,
            body
        
    }`

  const post = await sanityClient.fetch(query, { slug: params?.slug })

  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
    revalidate: 60, //Page refresh every 60 seconds, update the old cache
  }
}
