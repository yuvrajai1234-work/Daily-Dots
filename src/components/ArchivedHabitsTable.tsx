
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, RotateCcw } from "lucide-react";

const ArchivedHabitsTable = ({ archivedHabits, onUnarchive }) => (
  <Card>
    <CardHeader>
      <CardTitle>Archived & Past Habits</CardTitle>
      <CardDescription>
        Review your ditched or completed habits from the last 4-week cycle.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Habit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {archivedHabits.map((habit) => (
            <TableRow key={habit.id}>
              <TableCell className="font-medium flex items-center">
                {habit.icon && <span className="mr-2 text-2xl">{habit.icon}</span>}
                {habit.name}
              </TableCell>
              <TableCell>
                <Badge variant="outline">Archived</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onUnarchive(habit.id)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Unarchive
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default ArchivedHabitsTable;
