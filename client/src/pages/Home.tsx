import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  getKeyValue,
  Input,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  publishedDate: Date | string;
  totalSales: number;
  price: {
    amount: number;
    currency: string;
  };
};
const showPerPage = ["10", "20", "30", "50"];
const api = "http://localhost:3000";
const fetchBooks = async () => {
  const response = await fetch(`${api}/books`);
  const data = await response.json();
  return data;
};
const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [perPage, setPerPage] = useState<any>(new Set(["10"]));
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const filteredBooks = useMemo(() => {
    const limit =
      Number(Array.from(perPage)[0]) ||
      Number(getKeyValue(perPage, "currentKey")) ||
      10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const query = searchTitle.toLowerCase();

    const booksFiltered = books.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
    const booksSliced = booksFiltered.slice(start, end);
    const totalData = booksFiltered.length;
    const totalPage = Math.ceil(totalData / limit);
    return { books: booksSliced, totalPage, totalData };
  }, [books, searchTitle, perPage, page]);

  useEffect(() => {
    (async () => {
      const data = await fetchBooks();
      setBooks(data);
    })();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTitle]);

  return (
    <>
      <div className="container mx-auto py-10 font-inter">
        <Card className={cn("bg-card text-card-foreground")}>
          <CardHeader>
            <div>
              <h2 className="text-2xl font-semibold">Simple CRUD books </h2>
              <p className="text-sm">
                This is a simple CRUD application with ReactJS, Prisma, and
                NextUI.
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table
              aria-label="books table"
              aria-labelledby="books table"
              removeWrapper
              topContent={
                <div className="flex items-center justify-between w-full">
                  <div className="w-full flex items-center gap-4">
                    <Select
                      label="Show per page"
                      items={showPerPage.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      selectedKeys={perPage}
                      onSelectionChange={setPerPage}
                      className="w-full lg:w-32"
                    >
                      {(item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      )}
                    </Select>
                    <Input
                      label="Search title"
                      onChange={(e) => setSearchTitle(e.target.value)}
                      value={searchTitle}
                      className="w-full lg:w-64"
                    />
                  </div>
                  <div></div>
                </div>
              }
              bottomContent={
                filteredBooks.totalPage > 1 ? (
                  <div className="flex items-center justify-center">
                    <Pagination
                      total={filteredBooks.totalPage}
                      onChange={setPage}
                      radius="full"
                      aria-label="pagination"
                      aria-labelledby="pagination"
                    />
                  </div>
                ) : null
              }
            >
              <TableHeader>
                <TableColumn className="uppercase">title</TableColumn>
                <TableColumn className="uppercase">author</TableColumn>
                <TableColumn className="uppercase">publised</TableColumn>
                <TableColumn className="uppercase">sales</TableColumn>
                <TableColumn className="uppercase">price</TableColumn>
                <TableColumn className="uppercase">profit</TableColumn>
                <TableColumn className="uppercase">action</TableColumn>
              </TableHeader>
              <TableBody emptyContent={<EmptyTable />}>
                {filteredBooks.books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="capitalize">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      {new Date(book.publishedDate as string).toDateString()}
                    </TableCell>
                    <TableCell>{book.totalSales}</TableCell>
                    <TableCell>
                      {book.price.amount} {book.price.currency}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat().format(
                        book.totalSales * book.price.amount
                      )}{" "}
                      {book.price.currency}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          color="warning"
                          variant="flat"
                          isIconOnly
                          size="sm"
                        >
                          <Edit2 />
                        </Button>
                        <Button
                          color="danger"
                          variant="flat"
                          isIconOnly
                          size="sm"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

const EmptyTable = () => {
  return (
    <>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h1 className="text-4xl font-semibold">No data found</h1>
          <p className="text-lg">There is no data found in this table.</p>
        </div>
      </div>
    </>
  );
};
export default Home;
