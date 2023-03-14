// adventure based on adventureSlug

export default async function CurrentAdventure ({ params }: { params: { adventureSlug: string }}) {
  return (
    <div>
      { params.adventureSlug } adventure:
      <li>Google map with route and markers of the <strong className='text-xl'>{params.adventureSlug}</strong> adventure</li>
        <li>all blog posts from <strong className='text-xl'>{params.adventureSlug}</strong> adventure</li>
        <li>all images from <strong className='text-xl'>{params.adventureSlug}</strong> adventure</li>
    </div>
  );
}