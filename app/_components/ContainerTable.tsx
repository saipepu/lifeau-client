import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ContainerTable = ({ containers } : { containers: any[] }) => {
  return (
    <div className="w-full border-[1px] rounded-lg bg-white dark:bg-stone-950 bdr">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="w-full">
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Url</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {containers.map((container) => (
            <TableRow key={container.name}>
              <TableCell className="font-medium">{container.name}</TableCell>
              <TableCell>
                <a href={container.githubUrl} className="hover:underline">
                  git.repo 📎
                </a>
              </TableCell>
              <TableCell className="flex justify-end items-center">
                <div className={`
                  font-semibold p-1 px-2 rounded-md
                  ${container.status === "DEPLOYED" && "text-green-500 bg-green-200 dark:opacity-90"}
                  ${container.status === "PENDING" && "text-yellow-500 bg-yellow-200 dark:opacity-90"}
                  ${container.status === "FAILED" && "text-red-500 bg-red-200 dark:opacity-90"}
                  `}>
                  {container.status}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">{containers.length}</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </div>
  )
}

export default ContainerTable