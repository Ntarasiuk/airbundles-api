import { Card, Image, Link, Text, useMediaQuery } from "@geist-ui/react";
import React from "react";

function ProductCard({
  width = "400px",
  height = "200px",
  image,
  url,
  description,
  title,
  subtitle,
}) {
  const isXS = useMediaQuery("xs");
  const isSM = useMediaQuery("sm");

  return (
    <Card width="100%">
      <Image src={image} height={height} alt={title} draggable={false} />
      <Text h4 mb={0}>
        {title}
      </Text>
      <Text type="secondary" small>
        {subtitle}
        {description ? (
          <div dangerouslySetInnerHTML={{ __html: description }} />
        ) : null}
      </Text>
      <Card.Footer>
        <Link block target="_blank" href={`${url}?tag=airbundles-20`}>
          Details
        </Link>
      </Card.Footer>
    </Card>
  );
}

export default ProductCard;
