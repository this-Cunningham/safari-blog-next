// location within an adventure

export default async function LocationWithinAdventure (
  { params }:
  { params: { adventureSlug: string; locationSlug: string }}) {
  return (
    <div>
      { params.locationSlug} Location blog posts/images within the {params.adventureSlug} adventure
    </div>
  );
}