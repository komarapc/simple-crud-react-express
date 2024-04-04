import { cn } from "@/lib/utils";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

const Home = () => {
  return (
    <>
      <div className="p-10">
        <Card className={cn(" bg-card text-card-foreground w-96")}>
          <CardHeader>
            <h1 className="text-lg font-semibold">Home</h1>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
export default Home;
