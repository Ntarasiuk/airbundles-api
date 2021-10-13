import {
  Card,
  Grid,
  Image,
  Link,
  Rating,
  Text,
  useMediaQuery,
} from "@geist-ui/react";
import NextLink from "next/link";
import React from "react";
function BundleCard({
  width = "400px",
  height = "200px",
  image,
  link,
  id,
  title,
  content,
  btnText,
  stars,
  showStars,
  objectPosition,
  badge,
}) {
  const isXS = useMediaQuery("xs");
  const isSM = useMediaQuery("sm");

  return (
    <NextLink target="_blank" href={`/bundles/edit/${id}`}>
      <Link style={{ width: "100%" }}>
        <Card width="100%">
          <Image
            style={{ objectFit: "cover", objectPosition }}
            src={image}
            height={height}
            alt="thing"
            draggable={false}
          />
          <Grid.Container gap={2}>
            <Grid md={12} xs>
              {showStars ? (
                <Rating value={stars} locked type="warning" />
              ) : null}
            </Grid>
            <Grid md={12} xs justify="flex-end">
              {badge}
            </Grid>
          </Grid.Container>

          <Text h4 mb={0}>
            {title}
          </Text>
          <Text type="secondary" small>
            {content}
          </Text>
          <Card.Footer>
            <Link block>{btnText || "Edit bundle"} </Link>
          </Card.Footer>
        </Card>
      </Link>
    </NextLink>
  );
}

export default BundleCard;
